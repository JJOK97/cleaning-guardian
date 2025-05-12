import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-konva';

const StyledLine = styled(Line)`
    linecap: 'round';
    linejoin: 'round';
    shadowcolor: ${({ theme }) => theme.colors.primary.main};
    shadowblur: 10;
    shadowopacity: 0.5;
`;

interface SliceTrailProps {
    points: number[];
    color: string;
    width: number;
}

const SliceTrail: React.FC<SliceTrailProps> = ({ points, color, width }) => {
    return (
        <StyledLine
            points={points}
            stroke={color}
            strokeWidth={width}
            tension={0.5}
            lineCap='round'
            lineJoin='round'
            shadowColor={color}
            shadowBlur={10}
            shadowOpacity={0.5}
        />
    );
};

export default SliceTrail;
