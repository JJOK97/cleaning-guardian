import React, { useEffect, useRef } from 'react';
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
    const lineRef = useRef<any>(null);

    useEffect(() => {
        if (!lineRef.current) return;

        const animate = () => {
            if (!lineRef.current) return;
            lineRef.current.opacity(lineRef.current.opacity() - 0.02);
            if (lineRef.current.opacity() > 0) {
                requestAnimationFrame(animate);
            }
        };

        lineRef.current.opacity(1);
        animate();
    }, [points]);

    return (
        <Line
            ref={lineRef}
            points={points}
            stroke={color}
            strokeWidth={width}
            lineCap='round'
            lineJoin='round'
            shadowColor={color}
            shadowBlur={10}
            shadowOpacity={0.5}
            globalCompositeOperation='lighter'
        />
    );
};

export default SliceTrail;
