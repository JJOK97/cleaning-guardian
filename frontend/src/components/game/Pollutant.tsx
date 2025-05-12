import React from 'react';
import { Circle } from 'react-konva';

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
        <Circle
            x={x}
            y={y}
            radius={radius}
            fill={color}
            shadowColor='black'
            shadowBlur={10}
            shadowOpacity={0.3}
            shadowOffset={{ x: 2, y: 2 }}
            onClick={onRemove}
        />
    );
};

export default Pollutant;
