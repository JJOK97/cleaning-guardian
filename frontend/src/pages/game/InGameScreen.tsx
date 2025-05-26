import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Stage, Layer, Circle } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
import SliceTrail from '@/components/game/SliceTrail';
import Pollutant from '@/components/game/Pollutant';
import GameBackground from '@/components/game/GameBackground';
import GamePreparationModal from '@/components/game/GamePreparationModal';
import LoadingScreen from '@/components/common/LoadingScreen';
import TransitionWrapper from '@/components/common/TransitionWrapper';
import Matter from 'matter-js';
import { startGame, completeGame, getStagePollutions } from '@/api/game';
import { useAuth } from '@/hooks/useAuth';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const GameUI = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
`;

const SettingsButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const Score = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

const Timer = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

const Lives = styled.div`
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.error.main};
    font-size: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

// 오염물질 정보 타입 (필요한 정보만)
interface PollutantBody {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    color: string;
    opacity: number;
}

// 게임 결과 타입 정의
interface GameResult {
    score: number;
    stageId: number;
    timeSpent: number;
    pollutantsRemoved: number;
    maxCombo: number;
}

const InGameScreen: React.FC = () => {
    const navigate = useNavigate();
    const { stageId, mapId } = useParams<{ stageId: string; mapId: string }>();
    const { user, loading: authLoading } = useAuth();

    // 모든 state 선언
    const [score, setScore] = useState(0);
    const [slicePoints, setSlicePoints] = useState<number[]>([]);
    const [isSlicing, setIsSlicing] = useState(false);
    const [showPreparation, setShowPreparation] = useState(true);
    const [time, setTime] = useState(60);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollutant, setPollutant] = useState<PollutantBody | null>(null);
    const [pollutantQueue, setPollutantQueue] = useState<PollutantBody[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameData, setGameData] = useState<{
        stageIdx: number | null;
        pollutions: any[];
    }>({
        stageIdx: null,
        pollutions: [],
    });
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // 모든 ref 선언
    const startTime = useRef(Date.now());
    const stageRef = useRef<any>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const bodyRef = useRef<Matter.Body | null>(null);
    const animationRef = useRef<number | null>(null);

    // 모든 callback 선언
    const updateStageSize = useCallback(() => {
        if (stageRef.current) {
            const container = stageRef.current.container();
            const newSize = {
                width: container.offsetWidth || window.innerWidth,
                height: container.offsetHeight || window.innerHeight,
            };
            setStageSize(newSize);
        }
    }, []);

    const handlePollutantSlice = useCallback(() => {
        if (!pollutant || gameEnded) return;
        setScore((prev) => prev + 100);
        setCombo((prev) => {
            const newCombo = prev + 1;
            setMaxCombo((prevMax) => Math.max(prevMax, newCombo));
            return newCombo;
        });
        setPollutant(null);
        if (bodyRef.current && engineRef.current) {
            Matter.World.remove(engineRef.current.world, bodyRef.current);
            bodyRef.current = null;
        }
        setTimeout(() => {
            if (!gameEnded) {
                setCurrentIndex((idx) => idx + 1);
            }
        }, 100);
    }, [pollutant, gameEnded]);

    const endGame = useCallback(async () => {
        if (!user?.email || !gameData.stageIdx || gameEnded) return;
        setGameEnded(true);
        const isSuccess = lives > 0 && time > 0 && currentIndex >= pollutantQueue.length;
        const successYn = isSuccess ? 'Y' : 'N';

        try {
            // 최대 3번까지 재시도
            let retryCount = 0;
            let clearResponse;

            while (retryCount < 3) {
                try {
                    clearResponse = await completeGame(gameData.stageIdx, user.email, successYn);
                    if (clearResponse.success) break;
                } catch (error) {
                    console.error(`게임 종료 처리 시도 ${retryCount + 1} 실패:`, error);
                    retryCount++;
                    if (retryCount === 3) throw error;
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
                }
            }

            if (!clearResponse) {
                throw new Error('게임 종료 처리 실패');
            }

            const result = {
                score,
                stageIdx: gameData.stageIdx,
                timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
                pollutantsRemoved: currentIndex,
                maxCombo,
                success: clearResponse.success,
                message: clearResponse.message,
                successYn: clearResponse.successYn,
                email: user.email,
                mapIdx: Number(mapId) || 1,
            };

            if (isSuccess) {
                localStorage.setItem('lastClearedStage', gameData.stageIdx.toString());
                localStorage.setItem('currentMapIdx', result.mapIdx.toString());
            }

            setTimeout(() => {
                navigate('/result', { state: result });
            }, 1000);
        } catch (error) {
            console.error('게임 종료 처리 중 오류 발생:', error);
            // 에러 발생 시에도 결과 화면으로 이동
            navigate('/result', {
                state: {
                    score,
                    stageIdx: gameData.stageIdx,
                    timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
                    pollutantsRemoved: currentIndex,
                    maxCombo,
                    success: false,
                    message: '게임 종료 처리 중 오류가 발생했습니다.',
                    email: user.email,
                    mapIdx: Number(mapId) || 1,
                },
            });
        }
    }, [
        gameData.stageIdx,
        lives,
        time,
        score,
        currentIndex,
        maxCombo,
        navigate,
        user?.email,
        pollutantQueue.length,
        mapId,
        gameEnded,
    ]);

    // 게임 초기화 함수
    const initializeGame = async () => {
        if (!user?.email || !stageId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const startResponse = await startGame(user.email, parseInt(stageId));
            if (!startResponse.success) {
                setIsLoading(false);
                return;
            }

            setGameData((prev) => ({ ...prev, stageIdx: startResponse.stageIdx }));

            const pollutionsResponse = await getStagePollutions(parseInt(stageId));
            if (!pollutionsResponse.success) {
                setIsLoading(false);
                return;
            }

            setGameData((prev) => ({ ...prev, pollutions: pollutionsResponse.pollutionsList || [] }));
        } catch (error) {
            console.error('게임 초기화 중 오류 발생:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    // 모든 effect 선언
    useEffect(() => {
        if (!authLoading && !user) {
            console.error('사용자 정보가 없습니다. 메인 화면으로 이동합니다.');
            navigate('/main');
        }
    }, [user, authLoading, stageId, mapId, navigate]);

    useEffect(() => {
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, [updateStageSize]);

    useEffect(() => {
        if (showPreparation) return;
        const { width, height } = stageSize;
        // 더 적은 수의 오염물질을 생성하여 디버깅하기 쉽게 함
        const totalPollutants = Math.floor((width * height) / 50000); // 더 적은 수의 오염물질
        const queue: PollutantBody[] = [];
        for (let i = 0; i < totalPollutants; i++) {
            const radius = Math.random() * 20 + 30; // 더 큰 반지름으로 변경
            const color = Math.random() > 0.5 ? '#4CAF50' : '#2196F3';
            // 오염물질이 화면 안쪽에 생성되도록 수정
            const startX = width * 0.2 + Math.random() * (width * 0.6);
            const startY = 100; // 화면 상단에서 시작하도록 변경
            queue.push({
                id: i,
                x: startX,
                y: startY,
                angle: 0,
                radius,
                color,
                opacity: 1,
            });
        }
        setPollutantQueue(queue);
        setCurrentIndex(0);
    }, [stageSize, showPreparation]);

    useEffect(() => {
        if (showPreparation || gameEnded) return;
        if (!pollutantQueue.length) return;
        // 게임 종료 확인
        if (currentIndex >= pollutantQueue.length) {
            endGame();
            return;
        }

        // 엔진 생성
        const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.3 } }); // 중력 약하게 조정
        engineRef.current = engine;
        const world = engine.world;

        // 현재 오염물질 바디 생성
        const p = pollutantQueue[currentIndex];
        if (!p) return;

        const body = Matter.Bodies.circle(p.x, p.y, p.radius, {
            restitution: 0.6,
            friction: 0.1,
            density: 0.001,
            velocity: {
                x: Math.random() * 4 - 2, // 좌우 속도 감소
                y: 1 + Math.random() * 2, // 아래로 떨어지는 속도 조정
            },
        });
        bodyRef.current = body;
        Matter.World.add(world, body);
        setPollutant({ ...p });

        // 애니메이션 루프
        const animate = () => {
            if (!bodyRef.current) return;
            Matter.Engine.update(engine, 1000 / 60);
            setPollutant((prev) =>
                prev && bodyRef.current
                    ? {
                          ...prev,
                          x: bodyRef.current.position.x,
                          y: bodyRef.current.position.y,
                          angle: bodyRef.current.angle,
                      }
                    : prev,
            );
            // 화면 아래로 벗어나면
            if (bodyRef.current.position.y - p.radius > stageSize.height) {
                console.log('Pollutant fell off screen:', bodyRef.current.position.y);
                setLives((prev) => {
                    const newLives = Math.max(prev - 1, 0);
                    if (newLives === 0) {
                        setTimeout(() => {
                            endGame();
                        }, 100);
                    }
                    return newLives;
                });
                setPollutant(null);
                Matter.World.remove(world, bodyRef.current);
                bodyRef.current = null;
                setTimeout(() => {
                    if (!gameEnded) {
                        setCurrentIndex((idx) => idx + 1);
                    }
                }, 800); // 다음 오염물질 등장 시간 증가
                return;
            }

            // 화면 밖으로 너무 멀리 나가는 경우 방지
            if (
                bodyRef.current.position.x < -p.radius * 2 ||
                bodyRef.current.position.x > stageSize.width + p.radius * 2
            ) {
                // 화면 안으로 다시 들어오도록 힘을 가함
                Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, {
                    x: bodyRef.current.position.x < 0 ? 0.005 : -0.005,
                    y: 0,
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
        };
    }, [pollutantQueue, currentIndex, stageSize.height, showPreparation, gameEnded]);

    useEffect(() => {
        if ((lives === 0 || time === 0 || currentIndex >= pollutantQueue.length) && !gameEnded) {
            endGame();
        }
    }, [lives, time, currentIndex, pollutantQueue.length, gameEnded, endGame]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!showPreparation && !gameEnded) {
            timer = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showPreparation, gameEnded]);

    // 로딩 중이거나 사용자 정보가 없으면 로딩 화면 표시
    if (authLoading || !user) {
        return <LoadingScreen />;
    }

    // 스테이지별 배경 이미지 경로 생성
    const getStageBackground = (stageId: string) => {
        return `/assets/img/ingame/stage${stageId}.png`;
    };

    // 나머지 렌더링 로직
    return (
        <Container>
            <GameBackground backgroundImage={getStageBackground(stageId || '1')} />
            <GameUI>
                <SettingsButton
                    onClick={() => {
                        // TODO: 설정 모달 구현
                        console.log('설정 버튼 클릭');
                    }}
                >
                    <img
                        src='/src/assets/icons/settings.svg'
                        alt='설정'
                    />
                </SettingsButton>
                <Score>점수: {score}</Score>
                <Timer>시간: {time}</Timer>
                <Lives>
                    {Array.from({ length: lives }).map((_, index) => (
                        <span key={index}>❤️</span>
                    ))}
                </Lives>
                {combo > 1 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '4rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#4CAF50',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                        }}
                    >
                        {combo}콤보!
                    </div>
                )}

                {/* 디버그 정보 표시 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        color: 'white',
                        fontSize: '0.8rem',
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '0.5rem',
                        borderRadius: '5px',
                    }}
                >
                    오염물질: {currentIndex + 1}/{pollutantQueue.length || 0}
                    {pollutant && ` (x: ${Math.round(pollutant.x)}, y: ${Math.round(pollutant.y)})`}
                </div>
            </GameUI>
            {showPreparation && (
                <GamePreparationModal
                    isOpen={showPreparation}
                    onClose={() => setShowPreparation(false)}
                    onStart={() => {
                        startTime.current = Date.now();
                        setShowPreparation(false);
                        initializeGame();
                    }}
                    stageInfo={{
                        name: '스테이지 시작',
                        description: '준비되셨나요?',
                        difficulty: 'easy',
                    }}
                />
            )}
            <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
                onMouseDown={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onMouseMove={(e) => {
                    if (gameEnded || showPreparation || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 슬라이스가 현재 오염물질과 충돌하는지 확인
                    if (pollutant) {
                        const { x, y, radius } = pollutant;
                        const lastIdx = slicePoints.length;
                        if (lastIdx >= 4) {
                            const x1 = slicePoints[lastIdx - 4];
                            const y1 = slicePoints[lastIdx - 3];
                            const x2 = slicePoints[lastIdx - 2];
                            const y2 = slicePoints[lastIdx - 1];

                            // 선분과 원의 충돌 검사
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const lineLength = Math.sqrt(dx * dx + dy * dy);

                            if (lineLength > 0) {
                                const distance = Math.abs((dy * x - dx * y + x2 * y1 - x1 * y2) / lineLength);

                                if (distance < radius) {
                                    handlePollutantSlice();
                                }
                            }
                        }
                    }
                }}
                onMouseUp={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례)
                    if (length > 50) {
                        setScore((prev) => prev + Math.floor(length / 10));
                    }

                    // 조금 시간이 지난 후 슬라이스 트레일 초기화
                    setTimeout(() => {
                        setSlicePoints([]);
                    }, 200);
                }}
                onTouchStart={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onTouchMove={(e) => {
                    if (gameEnded || showPreparation || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 슬라이스가 현재 오염물질과 충돌하는지 확인
                    if (pollutant) {
                        const { x, y, radius } = pollutant;
                        const lastIdx = slicePoints.length;
                        if (lastIdx >= 4) {
                            const x1 = slicePoints[lastIdx - 4];
                            const y1 = slicePoints[lastIdx - 3];
                            const x2 = slicePoints[lastIdx - 2];
                            const y2 = slicePoints[lastIdx - 1];

                            // 선분과 원의 충돌 검사
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const lineLength = Math.sqrt(dx * dx + dy * dy);

                            if (lineLength > 0) {
                                const distance = Math.abs((dy * x - dx * y + x2 * y1 - x1 * y2) / lineLength);

                                if (distance < radius) {
                                    handlePollutantSlice();
                                }
                            }
                        }
                    }
                }}
                onTouchEnd={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례)
                    if (length > 50) {
                        setScore((prev) => prev + Math.floor(length / 10));
                    }

                    // 조금 시간이 지난 후 슬라이스 트레일 초기화
                    setTimeout(() => {
                        setSlicePoints([]);
                    }, 200);
                }}
            >
                <Layer>
                    {/* 슬라이스 트레일 */}
                    {isSlicing && slicePoints.length >= 4 && <SliceTrail points={slicePoints} />}

                    {/* 오염물질 */}
                    {pollutant && (
                        <Pollutant
                            key={pollutant.id}
                            id={pollutant.id}
                            x={pollutant.x}
                            y={pollutant.y}
                            angle={pollutant.angle}
                            radius={pollutant.radius}
                            color={pollutant.color}
                            opacity={pollutant.opacity}
                            onRemove={handlePollutantSlice}
                        />
                    )}

                    {/* 스테이지 경계선 표시 (디버깅용) */}
                    {/* 디버그 표시 - 항상 보이도록 수정 */}
                    <Circle
                        x={stageSize.width / 2}
                        y={stageSize.height / 2}
                        radius={5}
                        fill='red'
                    />
                </Layer>
            </Stage>
            <TransitionWrapper $isVisible={true}>
                <div />
            </TransitionWrapper>
        </Container>
    );
};

export default InGameScreen;
