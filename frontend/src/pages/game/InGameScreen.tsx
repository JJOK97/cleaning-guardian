import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Stage, Layer } from 'react-konva';
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

const Container = styled.div<{ $screenShake?: boolean; $pollutionLevel?: number }>`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    /* 오염도에 따른 어두워지는 효과 */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, ${(props) => (props.$pollutionLevel || 0) * 0.008});
        pointer-events: none;
        z-index: 1;
        transition: background 0.5s ease-in-out;
    }

    /* 화면 진동 애니메이션 */
    ${(props) =>
        props.$screenShake &&
        `
        animation: screenShake 0.1s ease-in-out;
    `}

    @keyframes screenShake {
        0%,
        100% {
            transform: translateX(0);
        }
        10% {
            transform: translateX(-3px) translateY(-2px);
        }
        20% {
            transform: translateX(3px) translateY(2px);
        }
        30% {
            transform: translateX(-2px) translateY(-1px);
        }
        40% {
            transform: translateX(2px) translateY(1px);
        }
        50% {
            transform: translateX(-1px) translateY(-1px);
        }
        60% {
            transform: translateX(1px) translateY(1px);
        }
        70% {
            transform: translateX(-1px) translateY(0);
        }
        80% {
            transform: translateX(1px) translateY(0);
        }
        90% {
            transform: translateX(0) translateY(-1px);
        }
    }
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

const TopGameUI = styled.div`
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    right: 0.7rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 100;
    gap: 0.5rem;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-start;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
`;

const GameInfoCard = styled.div`
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    padding: 0.8rem 1.2rem;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    min-width: fit-content;
`;

const Timer = styled(GameInfoCard)`
    color: #4caf50;
`;

const Score = styled(GameInfoCard)`
    color: #ffd700;
`;

const PollutionProgressBar = styled.div`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 300px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    overflow: hidden;
    pointer-events: none;
    z-index: 50;
`;

const PollutionFill = styled.div<{ $pollutionLevel: number }>`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${(props) => props.$pollutionLevel}%;
    background: ${(props) => {
        if (props.$pollutionLevel < 30) return 'linear-gradient(to top, #4caf50, #81c784)';
        if (props.$pollutionLevel < 60) return 'linear-gradient(to top, #ff9800, #ffb74d)';
        if (props.$pollutionLevel < 80) return 'linear-gradient(to top, #ff5722, #ff8a65)';
        return 'linear-gradient(to top, #d32f2f, #f44336)';
    }};
    transition: height 0.5s ease-in-out, background 0.3s ease-in-out;
    border-radius: 0 0 8px 8px;
`;

const PollutionIcon = styled.div<{ $pollutionLevel: number }>`
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    color: ${(props) => {
        if (props.$pollutionLevel < 30) return '#4caf50';
        if (props.$pollutionLevel < 60) return '#ff9800';
        if (props.$pollutionLevel < 80) return '#ff5722';
        return '#d32f2f';
    }};
    transition: color 0.3s ease-in-out;
`;

const PollutionText = styled.div<{ $pollutionLevel: number }>`
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    font-weight: bold;
    color: ${(props) => {
        if (props.$pollutionLevel < 30) return '#4caf50';
        if (props.$pollutionLevel < 60) return '#ff9800';
        if (props.$pollutionLevel < 80) return '#ff5722';
        return '#d32f2f';
    }};
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    white-space: nowrap;
    transition: color 0.3s ease-in-out;
`;

const BottomGameUI = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 100;
    pointer-events: none;
`;

const ProgressCard = styled(GameInfoCard)`
    color: #4fc3f7;
    border-color: rgba(79, 195, 247, 0.5);
    font-size: 1rem;
`;

interface PollutantBody {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    color: string;
    opacity: number;
    pollutionData?: any;
    pollutionImage?: string;
    isDefeated?: boolean;
    isPollutionBomb?: boolean;
    pollutionBombDamage?: number;
}

const InGameScreen: React.FC = () => {
    const navigate = useNavigate();
    const { stageId, mapId } = useParams<{ stageId: string; mapId: string }>();
    const { user, loading: authLoading } = useAuth();

    // 기본 게임 상태
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(60);
    const [pollutionLevel, setPollutionLevel] = useState(0);
    const [defeatedCount, setDefeatedCount] = useState(0);
    const [targetDefeatCount, setTargetDefeatCount] = useState(20);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showPreparation, setShowPreparation] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [screenShake, setScreenShake] = useState(false);

    // 스와이프 관련
    const [slicePoints, setSlicePoints] = useState<number[]>([]);
    const [isSlicing, setIsSlicing] = useState(false);
    const [sliceTrails, setSliceTrails] = useState<
        Array<{
            id: number;
            points: number[];
            opacity: number;
            timestamp: number;
        }>
    >([]);
    // 잔상은 드래그 끝날 때만 생성

    // 오염물질 관련
    const [activePollutants, setActivePollutants] = useState<PollutantBody[]>([]);
    const [activeBodies, setActiveBodies] = useState<Matter.Body[]>([]);
    const [pollutantQueue, setPollutantQueue] = useState<PollutantBody[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 게임 데이터
    const [gameData, setGameData] = useState<{
        stageIdx: number | null;
        pollutions: any[];
    }>({
        stageIdx: null,
        pollutions: [],
    });

    // 화면 크기
    const [stageSize, setStageSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // refs
    const stageRef = useRef<any>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const animationRef = useRef<number | null>(null);
    const activePollutantsRef = useRef<PollutantBody[]>([]);
    const activeBodiesRef = useRef<Matter.Body[]>([]);
    const startTime = useRef(Date.now());

    // 화면 크기 업데이트
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

    // 오염물질 처치 함수
    const handlePollutantSlice = useCallback(
        (targetPollutant?: PollutantBody) => {
            if (gameEnded || activePollutants.length === 0) return;

            let pollutantsToSlice: Array<{ pollutant: PollutantBody; body: Matter.Body; index: number }> = [];

            if (targetPollutant) {
                // 직접 클릭된 경우
                const pollutantIndex = activePollutants.findIndex((p) => p.id === targetPollutant.id);
                if (pollutantIndex >= 0) {
                    const body = activeBodies[pollutantIndex];
                    if (body && !(body as any).isDefeated) {
                        pollutantsToSlice.push({
                            pollutant: targetPollutant,
                            body: body,
                            index: pollutantIndex,
                        });
                    }
                }
            } else {
                // 스와이프로 처치하는 경우 - 전체 경로의 각 선분별로 정확하게 검사
                if (slicePoints.length >= 4) {
                    const checkedPollutants = new Set(); // 중복 처치 방지

                    // 모든 연속된 선분에 대해 검사
                    for (let segmentIdx = 0; segmentIdx < slicePoints.length - 2; segmentIdx += 2) {
                        const x1 = slicePoints[segmentIdx];
                        const y1 = slicePoints[segmentIdx + 1];
                        const x2 = slicePoints[segmentIdx + 2];
                        const y2 = slicePoints[segmentIdx + 3];

                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const lineLength = Math.sqrt(dx * dx + dy * dy);

                        // 선분이 너무 짧으면 건너뛰기
                        if (lineLength < 10) continue;

                        for (let i = 0; i < activePollutants.length; i++) {
                            const p = activePollutants[i];
                            const body = activeBodies[i];
                            if (!p || !body || (body as any).isDefeated || checkedPollutants.has(p.id)) continue;

                            const { x, y, radius } = p;

                            // 점과 선분 사이의 정확한 거리 계산
                            const A = x - x1;
                            const B = y - y1;
                            const C = dx;
                            const D = dy;

                            const dot = A * C + B * D;
                            const lenSq = C * C + D * D;
                            let param = -1;
                            if (lenSq !== 0) param = dot / lenSq;

                            let xx, yy;
                            if (param < 0) {
                                xx = x1;
                                yy = y1;
                            } else if (param > 1) {
                                xx = x2;
                                yy = y2;
                            } else {
                                xx = x1 + param * C;
                                yy = y1 + param * D;
                            }

                            const distance = Math.sqrt((x - xx) * (x - xx) + (y - yy) * (y - yy));

                            // 충돌 검사 범위를 적당히 (정확하게 베인 것만)
                            if (distance < radius * 0.6) {
                                pollutantsToSlice.push({
                                    pollutant: p,
                                    body: body,
                                    index: i,
                                });
                                checkedPollutants.add(p.id); // 중복 방지
                                break; // 이 선분에서 찾았으니 다음 선분으로
                            }
                        }
                    }
                }
            }

            if (pollutantsToSlice.length === 0) return;

            // 처치 처리
            pollutantsToSlice.forEach(({ pollutant, body }) => {
                if ((body as any).isDefeated) return;

                // 처치 상태 설정
                (body as any).isDefeated = true;

                // 폭탄인지 확인
                if (pollutant.isPollutionBomb) {
                    // 폭탄 처치 - 오염도 증가
                    const bombDamage = pollutant.pollutionBombDamage || 50;
                    setPollutionLevel((prev) => Math.min(prev + bombDamage, 100));

                    // 모든 오염물질 제거
                    if (engineRef.current) {
                        activeBodies.forEach((b) => {
                            try {
                                Matter.World.remove(engineRef.current!.world, b);
                            } catch (error) {
                                // 무시
                            }
                        });
                    }

                    setActivePollutants([]);
                    setActiveBodies([]);
                    activePollutantsRef.current = [];
                    activeBodiesRef.current = [];
                } else {
                    // 일반 오염물질 처치
                    setScore((prev) => prev + 100);
                    setDefeatedCount((prev) => prev + 1);

                    // 🎯 처치된 오염물질은 다른 오염물질과 충돌하지 않도록 설정
                    Matter.Body.set(body, {
                        isSensor: true, // 센서 모드로 변경 (충돌 감지는 하지만 물리적 반응 없음)
                        collisionFilter: {
                            category: 0x0002, // 처치된 오염물질 카테고리
                            mask: 0x0000, // 아무것과도 충돌하지 않음
                        },
                    });

                    // 처치 효과 - 위로 날려보내기
                    const exitVelocity = {
                        x: (Math.random() - 0.5) * 8,
                        y: -6 - Math.random() * 4,
                    };
                    Matter.Body.setVelocity(body, exitVelocity);
                    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 2.0);

                    // 3초 후 제거
                    setTimeout(() => {
                        if (engineRef.current && body) {
                            try {
                                Matter.World.remove(engineRef.current.world, body);
                            } catch (error) {
                                // 무시
                            }
                        }
                    }, 10000);
                }

                // 타격감 효과
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 100);

                // 진동 API (사용자 상호작용 후에만 작동)
                try {
                    if (navigator.vibrate && document.hasFocus()) {
                        navigator.vibrate(30);
                    }
                } catch (error) {
                    // 진동 실패 시 무시
                }
            });
        },
        [gameEnded, activePollutants, activeBodies, slicePoints],
    );

    // 게임 종료 함수
    const endGame = useCallback(async () => {
        if (gameEnded || !user?.email || !gameData.stageIdx) return;

        setGameEnded(true);

        // 물리 엔진 정리
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (engineRef.current) {
            activeBodies.forEach((body) => {
                try {
                    Matter.World.remove(engineRef.current!.world, body);
                } catch (error) {
                    // 무시
                }
            });
            Matter.Engine.clear(engineRef.current);
            engineRef.current = null;
        }

        // 성공 여부 판정
        const isSuccess = defeatedCount >= targetDefeatCount && pollutionLevel < 100;
        const successYn = isSuccess ? 'Y' : 'N';

        try {
            await completeGame(gameData.stageIdx, user.email, successYn);
        } catch (error) {
            // API 실패해도 계속 진행
        }

        // 결과 화면으로 이동
        const result = {
            score,
            stageIdx: gameData.stageIdx,
            timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
            pollutantsRemoved: defeatedCount,
            maxCombo: 0,
            success: isSuccess,
            message: isSuccess ? '성공!' : '실패!',
            successYn,
            email: user.email,
            mapIdx: Number(mapId) || 1,
        };

        navigate('/result', { state: result });
    }, [
        gameEnded,
        user?.email,
        gameData.stageIdx,
        defeatedCount,
        targetDefeatCount,
        pollutionLevel,
        score,
        mapId,
        navigate,
        activeBodies,
    ]);

    // 게임 초기화
    const initializeGame = useCallback(async () => {
        if (!user?.email || !stageId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // 게임 시작 API 호출
            const startResponse = await startGame(user.email, parseInt(stageId));
            if (!startResponse.success) {
                setIsLoading(false);
                return;
            }

            // 오염물질 정보 조회
            const pollutionsResponse = (await getStagePollutions(parseInt(stageId))) as any;
            if (!pollutionsResponse || !pollutionsResponse.success) {
                setIsLoading(false);
                return;
            }

            // 게임 데이터 설정
            setGameData({
                stageIdx: startResponse.stageIdx,
                pollutions: pollutionsResponse.pollutionsList || [],
            });
        } catch (error) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email, stageId]);

    // 오염물질 큐 생성
    useEffect(() => {
        if (showPreparation || !gameStarted || !gameData.pollutions?.length) return;

        const currentStage = parseInt(stageId || '1');
        const mapNumber = parseInt(mapId || '1');

        // 목표 개수 설정
        let targetCount = currentStage * 5; // 스테이지 × 5로 변경 (8스테이지 = 40개)
        if (mapNumber === 2) targetCount += 5;
        else if (mapNumber === 3) targetCount += 10;
        targetCount = Math.max(15, Math.min(targetCount, 100)); // 최대 100개까지 허용
        setTargetDefeatCount(targetCount);

        // 실제 떨어지는 개수 (목표의 2배로 확실히 설정)
        let totalPollutants = targetCount * 3; // 정확히 2배
        totalPollutants = Math.max(30, Math.min(totalPollutants, 200)); // 최소 30개, 최대 200개

        const { width, height } = stageSize;
        const queue: PollutantBody[] = [];

        let idCounter = 0;
        const generateUniqueId = () => {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000000);
            const counter = ++idCounter;
            return timestamp * 1000000 + random * 1000 + counter;
        };

        for (let i = 0; i < totalPollutants; i++) {
            // 25% 확률로 폭탄 생성 (15% → 25%로 증가)
            const isPollutionBomb = Math.random() < 0.3;

            if (isPollutionBomb) {
                // 폭탄 생성
                const radius = 40;
                let bombDamage = 30;
                if (mapNumber === 2) bombDamage = 40;
                else if (mapNumber === 3) bombDamage = 50;

                const startX = width * 0.1 + Math.random() * (width * 0.8);
                const startY = -radius * 2;

                queue.push({
                    id: generateUniqueId(),
                    x: startX,
                    y: startY,
                    angle: 0,
                    radius,
                    color: '#ff0000',
                    opacity: 1,
                    isPollutionBomb: true,
                    pollutionBombDamage: bombDamage,
                    pollutionImage: 'bomb.png',
                });
            } else {
                // 일반 오염물질 생성
                const selectedPollution = gameData.pollutions[Math.floor(Math.random() * gameData.pollutions.length)];
                const radius = Math.random() * 20 + 30;
                const startX = width * 0.1 + Math.random() * (width * 0.8);
                const startY = -radius * 2;

                queue.push({
                    id: generateUniqueId(),
                    x: startX,
                    y: startY,
                    angle: 0,
                    radius,
                    color: '#8B4513',
                    opacity: 1,
                    pollutionData: selectedPollution,
                    pollutionImage: selectedPollution.polImg1,
                });
            }
        }

        setPollutantQueue(queue);
        setCurrentIndex(0);
    }, [stageSize, showPreparation, gameStarted, gameData.pollutions, stageId, mapId]);

    // 물리 엔진 및 스폰 시스템
    useEffect(() => {
        if (showPreparation || gameEnded || !gameStarted || !pollutantQueue.length) return;

        // 물리 엔진 생성 (중력 더 증가)
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 0.5 }, // 0.18 → 0.22로 더 빠르게
            enableSleeping: false,
        });

        engineRef.current = engine;

        let spawnIndex = 0;
        const maxActive = 5; // 동시에 나오는 개수 더 줄임 (3 → 2)
        let lastSpawnTime = 0;
        const spawnInterval = 400; // 스폰 간격 대폭 늘림 (800ms → 1500ms)

        // 스폰 함수
        const spawnPollutant = () => {
            if (spawnIndex >= pollutantQueue.length || gameEnded) return;

            const pollutantData = pollutantQueue[spawnIndex];

            const body = Matter.Bodies.circle(pollutantData.x, pollutantData.y, pollutantData.radius, {
                restitution: 0.1,
                friction: 0.01,
                density: 0.001,
                frictionAir: 0.002, // 공기 저항 약간 증가로 부드러운 움직임
                isSleeping: false,
                sleepThreshold: Infinity,
                // 🎯 오염물질들끼리 충돌하지 않도록 설정
                collisionFilter: {
                    category: 0x0001, // 일반 오염물질 카테고리
                    mask: 0x0000, // 아무것과도 충돌하지 않음 (벽이나 바닥과만 충돌하려면 0x0004 등 추가)
                },
                render: {
                    // 렌더링 최적화
                    visible: true,
                },
            });

            const velocity = {
                x: (Math.random() - 0.5) * 0.4, // 좌우 움직임 더 증가 (0.36 → 0.4)
                y: 0.6 + Math.random() * 0.4, // 떨어지는 속도 더 증가 (0.48~0.72 → 0.6~0.9)
            };
            Matter.Body.setVelocity(body, velocity);
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);

            (body as any).pollutantId = pollutantData.id;
            (body as any).isDefeated = false;

            Matter.World.add(engine.world, body);

            activePollutantsRef.current = [...activePollutantsRef.current, pollutantData];
            activeBodiesRef.current = [...activeBodiesRef.current, body];

            // setState 호출을 줄여서 성능 개선 (ref로 관리하고 애니메이션 루프에서 업데이트)
            setCurrentIndex(spawnIndex + 1);

            spawnIndex++;
        };

        // 초기 스폰
        spawnPollutant();
        lastSpawnTime = Date.now();

        // 애니메이션 루프
        let frameCount = 0;
        let lastTime = performance.now();

        const animate = (currentTime: number) => {
            if (!engineRef.current || gameEnded) return;

            // 델타 타임 계산으로 부드러운 애니메이션
            const deltaTime = Math.min(currentTime - lastTime, 33.33); // 최대 30fps로 제한
            lastTime = currentTime;

            // 물리 엔진 업데이트를 더 부드럽게
            Matter.Engine.update(engineRef.current, deltaTime);
            frameCount++;

            // 위치 업데이트
            const currentPollutants = activePollutantsRef.current;
            const currentBodies = activeBodiesRef.current;
            const updatedPollutants: PollutantBody[] = [];
            const bodiesToRemove: Matter.Body[] = [];

            currentPollutants.forEach((pollutant, index) => {
                const body = currentBodies[index];
                if (!body) return;

                // 화면 밖 체크
                const margin = pollutant.radius * 2;
                const isOffScreen =
                    body.position.y > stageSize.height + margin ||
                    body.position.x < -margin ||
                    body.position.x > stageSize.width + margin;

                if (isOffScreen) {
                    // 오염도 증가 (일반 오염물질만)
                    if (!(body as any).isDefeated && !pollutant.isPollutionBomb) {
                        setPollutionLevel((prev) => {
                            const newLevel = Math.min(prev + 20, 100);
                            if (newLevel >= 100) setTimeout(() => endGame(), 100);
                            return newLevel;
                        });
                    }
                    bodiesToRemove.push(body);
                    return;
                }

                // 위치 업데이트 (투명도 완전 고정)
                updatedPollutants.push({
                    ...pollutant,
                    x: body.position.x,
                    y: body.position.y,
                    angle: body.angle,
                    opacity: 1, // 투명도 완전 고정으로 깜빡임 방지
                    color: pollutant.color, // 색상도 고정
                    isDefeated: (body as any).isDefeated || false, // 처치 상태 추가
                });
            });

            // 제거할 바디들 정리
            bodiesToRemove.forEach((body) => {
                if (engineRef.current) {
                    Matter.World.remove(engineRef.current.world, body);
                }
            });

            // ref 업데이트 (로그 제거)
            if (bodiesToRemove.length > 0) {
                activePollutantsRef.current = updatedPollutants;
                activeBodiesRef.current = currentBodies.filter((body) => !bodiesToRemove.includes(body));
            } else {
                activePollutantsRef.current = updatedPollutants;
            }

            // UI 업데이트 (5프레임마다로 늘려서 부드러운 움직임)
            if (frameCount % 5 === 0 || bodiesToRemove.length > 0) {
                setActivePollutants([...activePollutantsRef.current]);
                setActiveBodies([...activeBodiesRef.current]);
            }

            // 스폰 로직
            const currentActiveCount = activePollutantsRef.current.length;
            const spawnTime = Date.now();

            if (
                currentActiveCount < maxActive &&
                spawnIndex < pollutantQueue.length &&
                !gameEnded &&
                spawnTime - lastSpawnTime >= spawnInterval
            ) {
                spawnPollutant();
                lastSpawnTime = spawnTime;
            }

            if (!gameEnded) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
                engineRef.current = null;
            }
        };
    }, [gameStarted, showPreparation, gameEnded, pollutantQueue.length]);

    useEffect(() => {
        if (defeatedCount >= targetDefeatCount && targetDefeatCount > 0 && !gameEnded && gameStarted) {
            endGame();
        } else if (pollutionLevel >= 100 && !gameEnded && gameStarted) {
            endGame();
        } else if (time === 0 && !gameEnded && gameStarted) {
            endGame();
        }
    }, [pollutionLevel, time, defeatedCount, targetDefeatCount, gameEnded, gameStarted]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!showPreparation && !gameEnded && gameStarted) {
            // gameStarted 조건 추가
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
    }, [showPreparation, gameEnded, gameStarted]); // gameStarted 의존성 추가

    // 초기화
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/main');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user?.email && stageId && !gameData.stageIdx) {
            initializeGame();
        }
    }, [user?.email, stageId, gameData.stageIdx, initializeGame]);

    useEffect(() => {
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, []);

    // ref 동기화
    useEffect(() => {
        activePollutantsRef.current = activePollutants;
    }, [activePollutants]);

    useEffect(() => {
        activeBodiesRef.current = activeBodies;
    }, [activeBodies]);

    // 슬라이스 잔상 효과 업데이트
    useEffect(() => {
        if (sliceTrails.length === 0) return;

        const interval = setInterval(() => {
            setSliceTrails((prev) => {
                const now = Date.now();
                return prev
                    .map((trail) => ({
                        ...trail,
                        opacity: Math.max(0, 1 - (now - trail.timestamp) / 800), // 0.8초에 걸쳐 페이드아웃
                    }))
                    .filter((trail) => trail.opacity > 0.05); // 거의 투명해지면 제거
            });
        }, 16); // 60fps로 업데이트

        return () => clearInterval(interval);
    }, [sliceTrails.length]);

    // 로딩 중이거나 사용자 정보가 없으면 로딩 화면 표시
    if (authLoading || !user || isLoading) {
        return <LoadingScreen />;
    }

    // 스테이지별 배경 이미지 경로 생성
    const getStageBackground = (stageId: string) => {
        return `/assets/img/ingame/stage${stageId}.png`;
    };

    // 나머지 렌더링 로직
    return (
        <Container
            data-testid='game-container'
            $screenShake={screenShake}
            $pollutionLevel={pollutionLevel}
        >
            <GameBackground backgroundImage={getStageBackground(stageId || '1')} />
            <GameUI>
                <TopGameUI>
                    <LeftSection>
                        <Timer>
                            <img
                                src='/assets/img/common/clock.png'
                                alt='시간'
                                style={{ width: '24px', height: '24px' }}
                            />
                            {time}초
                        </Timer>
                    </LeftSection>

                    <RightSection>
                        <Score>
                            <img
                                src='/assets/img/common/thropy.png'
                                alt='점수'
                                style={{ width: '24px', height: '24px' }}
                            />
                            {score.toLocaleString()}
                        </Score>
                    </RightSection>
                </TopGameUI>

                {/* 세로 오염도 프로그레스바 */}
                <PollutionProgressBar>
                    <PollutionIcon $pollutionLevel={pollutionLevel}>
                        <img
                            src='/assets/img/common/earth.png'
                            alt='지구'
                            style={{
                                width: '24px',
                                height: '24px',
                                filter:
                                    pollutionLevel > 60
                                        ? `hue-rotate(${Math.min(pollutionLevel * 2, 120)}deg) saturate(1.5)`
                                        : 'none',
                            }}
                        />
                    </PollutionIcon>
                    <PollutionFill $pollutionLevel={pollutionLevel} />
                    <PollutionText $pollutionLevel={pollutionLevel}>{pollutionLevel}%</PollutionText>
                </PollutionProgressBar>

                {/* 하단 진행도 UI */}
                <BottomGameUI>
                    <ProgressCard>
                        정화 진행도: {defeatedCount}/{targetDefeatCount} 완료
                    </ProgressCard>
                </BottomGameUI>
            </GameUI>
            {showPreparation && (
                <GamePreparationModal
                    isOpen={showPreparation}
                    onClose={() => setShowPreparation(false)}
                    onStart={() => {
                        startTime.current = Date.now();
                        // 게임 시작 (데이터는 이미 로딩됨)
                        setShowPreparation(false);
                        setGameStarted(true); // 실제 게임 시작
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
                    if (gameEnded || showPreparation || !gameStarted) return; // gameStarted 조건 추가
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onMouseMove={(e) => {
                    if (gameEnded || showPreparation || !gameStarted || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;

                    // 스와이프 길이 제한 (최대 12개 포인트로 더 늘림)
                    if (slicePoints.length >= 24) {
                        // x,y 쌍이므로 12개 포인트 = 24개 값
                        setIsSlicing(false);
                        return;
                    }

                    // 이전 포인트와의 거리 체크 (너무 가까우면 무시)
                    if (slicePoints.length >= 2) {
                        const lastX = slicePoints[slicePoints.length - 2];
                        const lastY = slicePoints[slicePoints.length - 1];
                        const distance = Math.sqrt((point.x - lastX) ** 2 + (point.y - lastY) ** 2);
                        if (distance < 10) return; // 10픽셀 이하 움직임은 무시
                    }

                    setSlicePoints((prev) => {
                        const newPoints = [...prev, point.x, point.y];

                        // 🎯 슬라이스 감지 최적화: 8개 포인트마다 충돌 검사 (성능 개선)
                        if (newPoints.length % 8 === 0 && activePollutants.length > 0) {
                            setTimeout(() => handlePollutantSlice(), 0); // 비동기로 처리
                        }

                        // 드래그 중에는 잔상 생성하지 않음 (드래그 끝날 때만 생성)

                        return newPoints;
                    });
                }}
                onMouseUp={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;

                    // 드래그 끝날 때 마지막 슬라이스 검사
                    if (slicePoints.length >= 4 && activePollutants.length > 0) {
                        handlePollutantSlice();
                    }

                    // 잔상 효과를 위해 현재 슬라이스를 저장
                    if (slicePoints.length >= 4) {
                        const newTrail = {
                            id: Date.now() + Math.random(),
                            points: [...slicePoints],
                            opacity: 1,
                            timestamp: Date.now(),
                        };
                        setSliceTrails((prev) => [...prev, newTrail]);
                    }

                    setIsSlicing(false);
                    setSlicePoints([]); // 즉시 정리 (지연 제거)
                }}
                onTouchStart={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onTouchMove={(e) => {
                    if (gameEnded || showPreparation || !gameStarted || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;

                    // 스와이프 길이 제한 (최대 12개 포인트로 더 늘림)
                    if (slicePoints.length >= 24) {
                        // x,y 쌍이므로 12개 포인트 = 24개 값
                        setIsSlicing(false);
                        return;
                    }

                    // 이전 포인트와의 거리 체크 (너무 가까우면 무시)
                    if (slicePoints.length >= 2) {
                        const lastX = slicePoints[slicePoints.length - 2];
                        const lastY = slicePoints[slicePoints.length - 1];
                        const distance = Math.sqrt((point.x - lastX) ** 2 + (point.y - lastY) ** 2);
                        if (distance < 10) return; // 10픽셀 이하 움직임은 무시
                    }

                    setSlicePoints((prev) => {
                        const newPoints = [...prev, point.x, point.y];

                        // 🎯 슬라이스 감지 최적화: 8개 포인트마다 충돌 검사 (성능 개선)
                        if (newPoints.length % 8 === 0 && activePollutants.length > 0) {
                            setTimeout(() => handlePollutantSlice(), 0); // 비동기로 처리
                        }

                        // 드래그 중에는 잔상 생성하지 않음 (드래그 끝날 때만 생성)

                        return newPoints;
                    });
                }}
                onTouchEnd={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;

                    // 드래그 끝날 때 마지막 슬라이스 검사
                    if (slicePoints.length >= 4 && activePollutants.length > 0) {
                        handlePollutantSlice();
                    }

                    // 잔상 효과를 위해 현재 슬라이스를 저장
                    if (slicePoints.length >= 4) {
                        const newTrail = {
                            id: Date.now() + Math.random(),
                            points: [...slicePoints],
                            opacity: 1,
                            timestamp: Date.now(),
                        };
                        setSliceTrails((prev) => [...prev, newTrail]);
                    }

                    setIsSlicing(false);
                    setSlicePoints([]); // 즉시 정리 (지연 제거)
                }}
            >
                <Layer>
                    {/* 슬라이스 잔상 효과 */}
                    {sliceTrails.map((trail) => (
                        <SliceTrail
                            key={trail.id}
                            points={trail.points}
                            opacity={trail.opacity}
                            isAfterimage={true}
                        />
                    ))}

                    {/* 현재 슬라이스 트레일 */}
                    {isSlicing && slicePoints.length >= 4 && (
                        <SliceTrail
                            points={slicePoints}
                            opacity={1}
                            isAfterimage={false}
                        />
                    )}

                    {/* 다중 오염물질 */}
                    {activePollutants
                        .filter((pollutant) => pollutant && pollutant.id) // 🔥 유효한 오염물질만 렌더링
                        .map((pollutant, index) => (
                            <Pollutant
                                key={`pollutant-${pollutant.id}-${index}`} // 🔥 인덱스 추가로 절대 고유성 보장
                                id={pollutant.id}
                                x={pollutant.x}
                                y={pollutant.y}
                                angle={pollutant.angle}
                                radius={pollutant.radius}
                                color={pollutant.color}
                                opacity={pollutant.opacity}
                                onRemove={() => handlePollutantSlice(pollutant)}
                                // 게임 로직 개선: 오염물질 이미지 정보 전달
                                pollutionImage={(pollutant as any)?.pollutionImage}
                                pollutionName={(pollutant as any)?.pollutionData?.polName}
                                // 처치 상태 전달
                                isDefeated={(pollutant as any)?.isDefeated || false}
                                // 오염 폭탄 타입 전달
                                isPollutionBomb={(pollutant as any)?.isPollutionBomb || false}
                            />
                        ))}

                    {/* 디버그 표시 제거 */}
                </Layer>
            </Stage>
            <TransitionWrapper $isVisible={true}>
                <div />
            </TransitionWrapper>
        </Container>
    );
};

export default InGameScreen;
