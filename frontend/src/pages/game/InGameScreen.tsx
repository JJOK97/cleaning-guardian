import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useLocation, useNavigate } from 'react-router-dom';
import SliceTrail from '../../components/game/SliceTrail';
import Pollutant from '../../components/game/Pollutant';
import { PollutantData, GameResult } from '../../types/game';
import { colors } from '../../styles/colors';

const InGameScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stageId = (location.state as { stageId: number })?.stageId || 1;

    const [score, setScore] = useState(0);
    const [pollutants, setPollutants] = useState<PollutantData[]>([]);
    const [slicePoints, setSlicePoints] = useState<number[]>([]);
    const [isSlicing, setIsSlicing] = useState(false);
    const [startTime] = useState(Date.now());

    const stageRef = useRef<any>(null);
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const updateStageSize = () => {
            if (stageRef.current) {
                const container = stageRef.current.container();
                const newSize = {
                    width: container.offsetWidth || window.innerWidth,
                    height: container.offsetHeight || window.innerHeight,
                };
                setStageSize(newSize);
            }
        };

        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, []);

    useEffect(() => {
        const pollutantCount = stageId * 5 + 5;
        const safeMargin = 100; // 화면 가장자리에서의 안전 거리
        const maxX = stageSize.width - safeMargin;
        const maxY = stageSize.height - safeMargin;
        const minX = safeMargin;
        const minY = safeMargin;

        const newPollutants: PollutantData[] = Array.from({ length: pollutantCount }, (_, i) => ({
            id: i,
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
            radius: Math.random() * 20 + 20, // 20~40px 사이의 크기
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            isRemoved: false,
        }));
        setPollutants(newPollutants);
    }, [stageSize, stageId]);

    useEffect(() => {
        const allRemoved = pollutants.length > 0 && pollutants.every((p) => p.isRemoved);
        if (allRemoved) {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const result: GameResult = {
                score,
                stageId,
                timeSpent,
                pollutantsRemoved: pollutants.length,
            };
            setTimeout(() => {
                navigate('/result', { state: result });
            }, 1000);
        }
    }, [pollutants, score, navigate, stageId, startTime]);

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
        setScore((prev) => prev + Math.floor(length) + removedPollutants.length * 100);
        setPollutants((prev) =>
            prev.map((p) => (removedPollutants.some((rp) => rp.id === p.id) ? { ...p, isRemoved: true } : p)),
        );

        setSlicePoints([]);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: colors.background.light,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 'clamp(0.5rem, 2vw, 1rem)',
                    left: 'clamp(0.5rem, 2vw, 1rem)',
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem)',
                    borderRadius: '4px',
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                }}
            >
                점수: {score}
            </div>
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
                    backgroundColor: colors.background.main,
                    border: `2px solid ${colors.primary.main}`,
                    touchAction: 'none',
                }}
            >
                <Layer>
                    {pollutants.map((pollutant) => (
                        <Pollutant
                            key={pollutant.id}
                            x={pollutant.x}
                            y={pollutant.y}
                            radius={pollutant.radius}
                            color={pollutant.color}
                            isRemoved={pollutant.isRemoved}
                            onRemove={() => {
                                setPollutants((prev) =>
                                    prev.map((p) => (p.id === pollutant.id ? { ...p, isRemoved: true } : p)),
                                );
                                setScore((prev) => prev + 100);
                            }}
                        />
                    ))}
                    {slicePoints.length > 0 && (
                        <SliceTrail
                            points={slicePoints}
                            color={colors.primary.main}
                            width={5}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
};

export default InGameScreen;
