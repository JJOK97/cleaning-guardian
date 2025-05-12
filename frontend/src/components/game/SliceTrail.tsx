import React from 'react';
import { Line, Group, Circle } from 'react-konva';

interface SliceTrailProps {
    points: number[];
    color: string;
    width: number;
}

const SliceTrail: React.FC<SliceTrailProps> = ({ points, color, width }) => {
    return (
        <Group>
            {/* 메인 라인 */}
            <Line
                points={points}
                stroke={color}
                strokeWidth={width}
                lineCap='round'
                lineJoin='round'
                shadowColor={color}
                shadowBlur={15}
                shadowOpacity={0.8}
            />

            {/* 글로우 효과 */}
            <Line
                points={points}
                stroke='#fff'
                strokeWidth={width * 0.5}
                lineCap='round'
                lineJoin='round'
                opacity={0.5}
            />

            {/* 파티클 효과 */}
            {points.map((point, i) => {
                if (i % 4 === 0) {
                    return (
                        <Circle
                            key={i}
                            x={point}
                            y={points[i + 1]}
                            radius={width * 0.3}
                            fill='#fff'
                            opacity={0.6}
                        />
                    );
                }
                return null;
            })}
        </Group>
    );
};

export default SliceTrail;
