import React from 'react';
import { Circle, Group } from 'react-konva';

interface PollutantProps {
    x: number;
    y: number;
    radius: number;
    color: string;
    isRemoved: boolean;
    onRemove: () => void;
}

const Pollutant: React.FC<PollutantProps> = ({ x, y, radius, color, isRemoved, onRemove }) => {
    if (isRemoved) return null;

    return (
        <Group
            x={x}
            y={y}
        >
            {/* 그림자 효과 */}
            <Circle
                radius={radius + 5}
                fill='rgba(0,0,0,0.2)'
                offsetX={5}
                offsetY={5}
            />

            {/* 메인 원 */}
            <Circle
                radius={radius}
                fill={color}
                stroke='#fff'
                strokeWidth={2}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.3}
                shadowOffset={{ x: 2, y: 2 }}
            />

            {/* 내부 패턴 */}
            <Circle
                radius={radius * 0.7}
                fill='rgba(255,255,255,0.1)'
                stroke='#fff'
                strokeWidth={1}
            />

            {/* 반짝이는 효과 */}
            <Circle
                radius={radius * 0.2}
                fill='#fff'
                x={-radius * 0.3}
                y={-radius * 0.3}
                opacity={0.8}
            />
        </Group>
    );
};

export default Pollutant;
