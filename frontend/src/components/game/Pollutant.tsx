import React, { useEffect, useRef } from 'react';
import { Circle, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import styled from 'styled-components';

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

const Pollutant: React.FC<PollutantProps> = ({ id, x, y, radius, color, isRemoved, onRemove }) => {
    const groupRef = useRef<any>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (isRemoved) return;

        const animate = () => {
            if (!groupRef.current) return;

            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time + id) * 0.05;
            const rotation = Math.sin(time * 0.5 + id) * 10;

            groupRef.current.scale({ x: scale, y: scale });
            groupRef.current.rotation(rotation);

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [id, isRemoved]);

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
        onRemove();
    };

    if (isRemoved) return null;

    return (
        <Group
            ref={groupRef}
            x={x}
            y={y}
            onClick={handleClick}
            onTap={handleClick}
        >
            <Circle
                radius={radius}
                fill={color}
                opacity={0.8}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.3}
                shadowOffset={{ x: 2, y: 2 }}
            />
            <Circle
                radius={radius * 0.8}
                fill={color}
                opacity={0.6}
            />
            <Circle
                radius={radius * 0.6}
                fill={color}
                opacity={0.4}
            />
        </Group>
    );
};

export default Pollutant;
