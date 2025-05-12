import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Stage, Layer } from 'react-konva';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SliceTrail from '@/components/game/SliceTrail';
import Pollutant from '@/components/game/Pollutant';
import { PollutantData, GameResult } from '@/types/game';
import GameBackground from '@/components/game/GameBackground';
import GamePreparationModal from '@/components/game/GamePreparationModal';
import Button from '@/components/common/Button';
import LoadingScreen from '@/components/common/LoadingScreen';
import TransitionWrapper from '@/components/common/TransitionWrapper';

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

const InGameScreen: React.FC = () => {
    const navigate = useNavigate();
    const { stageId } = useParams<{ stageId: string }>();
    const [score, setScore] = useState(0);
    const [pollutants, setPollutants] = useState<PollutantData[]>([]);
    const [slicePoints, setSlicePoints] = useState<number[]>([]);
    const [isSlicing, setIsSlicing] = useState(false);
    const [startTime] = useState(Date.now());
    const [showPreparation, setShowPreparation] = useState(true);
    const [time, setTime] = useState(60);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [pollutantCount, setPollutantCount] = useState(0);
    const [maxPollutants, setMaxPollutants] = useState(0);

    const stageRef = useRef<any>(null);
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

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

    useEffect(() => {
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, [updateStageSize]);

    const generatePollutant = useCallback(() => {
        const { width, height } = stageSize;
        const minX = 50;
        const maxX = width - 50;
        const minY = 50;
        const maxY = height - 50;

        const newPollutant: PollutantData = {
            id: pollutantCount,
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
            radius: Math.random() * 20 + 20,
            color: Math.random() > 0.5 ? '#4CAF50' : '#2196F3',
            isRemoved: false,
        };

        setPollutants((prev) => [...prev, newPollutant]);
        setPollutantCount((prev) => prev + 1);
    }, [stageSize, pollutantCount]);

    useEffect(() => {
        if (!showPreparation) {
            const { width, height } = stageSize;
            const totalPollutants = Math.floor((width * height) / 10000);
            setMaxPollutants(totalPollutants);

            // 1초마다 새로운 오염물질 생성
            const interval = setInterval(() => {
                if (pollutantCount < totalPollutants) {
                    generatePollutant();
                } else {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showPreparation, stageSize, pollutantCount, generatePollutant]);

    useEffect(() => {
        const allRemoved = pollutants.length > 0 && pollutants.every((p) => p.isRemoved);
        if (allRemoved && stageId) {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const result: GameResult = {
                score,
                stageId: parseInt(stageId),
                timeSpent,
                pollutantsRemoved: pollutants.length,
                maxCombo,
            };
            setTimeout(() => {
                navigate('/result', { state: result });
            }, 1000);
        }
    }, [pollutants, score, navigate, stageId, startTime, maxCombo]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!showPreparation) {
            timer = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        const result: GameResult = {
                            score,
                            stageId: parseInt(stageId || '0'),
                            timeSpent: 60,
                            pollutantsRemoved: pollutants.filter((p) => p.isRemoved).length,
                            maxCombo,
                        };
                        navigate('/result', { state: result });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showPreparation, score, navigate, stageId, pollutants, maxCombo]);

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(loadingTimer);
    }, []);

    const handleMouseDown = (e: any) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setIsSlicing(true);
        setSlicePoints([point.x, point.y]);
    };

    const handleMouseMove = (e: any) => {
        e.evt.preventDefault();
        if (!isSlicing) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setSlicePoints((prev) => [...prev, point.x, point.y]);
    };

    const handleMouseUp = (e: any) => {
        e.evt.preventDefault();
        if (!isSlicing) return;
        setIsSlicing(false);

        // Calculate slice length
        let length = 0;
        for (let i = 0; i < slicePoints.length - 2; i += 2) {
            const dx = slicePoints[i + 2] - slicePoints[i];
            const dy = slicePoints[i + 3] - slicePoints[i + 1];
            length += Math.sqrt(dx * dx + dy * dy);
        }

        // Check for pollutants in slice path
        const removedPollutants = pollutants.filter((pollutant) => {
            if (pollutant.isRemoved) return false;
            for (let i = 0; i < slicePoints.length - 2; i += 2) {
                const dx = slicePoints[i + 2] - slicePoints[i];
                const dy = slicePoints[i + 3] - slicePoints[i + 1];
                const distance = Math.abs(
                    (dy * pollutant.x -
                        dx * pollutant.y +
                        slicePoints[i + 1] * slicePoints[i + 2] -
                        slicePoints[i] * slicePoints[i + 3]) /
                        Math.sqrt(dx * dx + dy * dy),
                );
                if (distance < pollutant.radius) return true;
            }
            return false;
        });

        // Update score and remove pollutants
        const removedCount = removedPollutants.length;
        if (removedCount > 0) {
            setCombo((prev) => {
                const newCombo = prev + removedCount;
                setMaxCombo((prevMax) => Math.max(prevMax, newCombo));
                return newCombo;
            });
            setScore((prev) => prev + Math.floor(length) + removedCount * 100 * (combo + 1));
        } else {
            setCombo(0);
        }

        setPollutants((prev) =>
            prev.map((p) => (removedPollutants.some((rp) => rp.id === p.id) ? { ...p, isRemoved: true } : p)),
        );

        setSlicePoints([]);
    };

    const handleGameStart = () => {
        setShowPreparation(false);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Container>
            <GameBackground />
            <GameUI>
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
            </GameUI>
            {showPreparation && (
                <GamePreparationModal
                    isOpen={showPreparation}
                    onClose={() => setShowPreparation(false)}
                    onStart={handleGameStart}
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
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                style={{
                    width: '100%',
                    height: '100%',
                    touchAction: 'none',
                }}
            >
                <Layer>
                    {pollutants.map((pollutant) => (
                        <Pollutant
                            key={pollutant.id}
                            {...pollutant}
                            onRemove={() => {
                                setPollutants((prev) =>
                                    prev.map((p) => (p.id === pollutant.id ? { ...p, isRemoved: true } : p)),
                                );
                                setScore((prev) => prev + 100 * (combo + 1));
                                setCombo((prev) => {
                                    const newCombo = prev + 1;
                                    setMaxCombo((prevMax) => Math.max(prevMax, newCombo));
                                    return newCombo;
                                });
                            }}
                        />
                    ))}
                    {slicePoints.length > 0 && (
                        <SliceTrail
                            points={slicePoints}
                            color='#4CAF50'
                            width={5}
                        />
                    )}
                </Layer>
            </Stage>
            <TransitionWrapper $isVisible={true}>
                <div />
            </TransitionWrapper>
        </Container>
    );
};

export default InGameScreen;
