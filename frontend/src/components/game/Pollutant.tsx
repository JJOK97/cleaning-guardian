import React from 'react';
import styled from 'styled-components';
import { Circle } from 'react-konva';

const StyledCircle = styled(Circle)`
    cursor: pointer;
    transition: opacity 0.3s ease;
`;

interface PollutantProps {
    id: number;
    x: number;
    y: number;
    radius: number;
    color: string;
    isRemoved: boolean;
    onRemove: () => void;
}

const Pollutant: React.FC<PollutantProps> = ({ x, y, radius, color, isRemoved, onRemove }) => {
    return (
        <StyledCircle
            x={x}
            y={y}
            radius={radius}
            fill={color}
            opacity={isRemoved ? 0 : 1}
            onClick={onRemove}
            onTap={onRemove}
        />
    );
};

export default Pollutant;
