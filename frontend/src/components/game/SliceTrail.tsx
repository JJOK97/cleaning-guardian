import React from 'react';
import { Line } from 'react-konva';

interface SliceTrailProps {
    points: number[];
    color: string;
    width: number;
}

const SliceTrail: React.FC<SliceTrailProps> = ({ points, color, width }) => {
    return (
        <Line
            points={points}
            stroke={color}
            strokeWidth={width}
            lineCap='round'
            lineJoin='round'
            shadowColor={color}
            shadowBlur={10}
            shadowOpacity={0.5}
        />
    );
};

export default SliceTrail;
