import React from 'react';
import { Circle, Group } from 'react-konva';

interface PollutantProps {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    color: string;
    opacity?: number;
    onRemove?: () => void;
}

const Pollutant: React.FC<PollutantProps> = ({ x, y, angle, radius, color, opacity = 1, onRemove }) => {
    return (
        <Group
            x={x}
            y={y}
            rotation={angle * (180 / Math.PI)}
            opacity={opacity}
            onClick={onRemove}
            onTap={onRemove}
        >
            {/* 외부 그림자 효과 */}
            <Circle
                radius={radius}
                fill={color}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.3}
                shadowOffset={{ x: 0, y: 2 }}
            />

            {/* 중간 레이어 */}
            <Circle
                radius={radius * 0.8}
                fill={color}
                opacity={0.6}
            />

            {/* 내부 레이어 */}
            <Circle
                radius={radius * 0.6}
                fill={color}
                opacity={0.4}
            />

            {/* 하이라이트 효과 */}
            <Circle
                radius={radius * 0.3}
                fill='white'
                opacity={0.2}
                x={-radius * 0.2}
                y={-radius * 0.2}
            />
        </Group>
    );
};

export default Pollutant;
