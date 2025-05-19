import styled from 'styled-components';
import { twinkle, float, rotate } from './animations';

export const Star = styled.div<{ $size: number; $top: number; $left: number; $delay: number }>`
    position: absolute;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    background-color: white;
    border-radius: 50%;
    top: ${(props) => props.$top}%;
    left: ${(props) => props.$left}%;
    animation: ${twinkle} ${(props) => 2 + props.$delay}s ease-in-out infinite;
    animation-delay: ${(props) => props.$delay}s;
    z-index: 1;
`;

export const SpaceParticle = styled.div<{
    $size: number;
    $top: number;
    $left: number;
    $delay: number;
    $duration: number;
}>`
    position: absolute;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    top: ${(props) => props.$top}%;
    left: ${(props) => props.$left}%;
    animation: ${float} ${(props) => props.$duration}s ease-in-out infinite;
    animation-delay: ${(props) => props.$delay}s;
    z-index: 2;
`;

export const Planet = styled.div<{
    $size: number;
    $top: number;
    $left: number;
    $color: string;
    $duration: number;
    $zIndex: number;
}>`
    position: absolute;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    border-radius: 50%;
    background: ${(props) => props.$color};
    box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.2);
    top: ${(props) => props.$top}%;
    left: ${(props) => props.$left}%;
    animation: ${rotate} ${(props) => props.$duration}s linear infinite;
    z-index: ${(props) => props.$zIndex};
`;

export const PlanetRing = styled.div<{ $size: number; $top: number; $left: number; $color: string; $rotation: number }>`
    position: absolute;
    width: ${(props) => props.$size * 1.5}px;
    height: ${(props) => props.$size * 0.3}px;
    background: transparent;
    border: 2px solid ${(props) => props.$color};
    border-radius: 50%;
    top: calc(${(props) => props.$top}% - ${(props) => props.$size * 0.15}px);
    left: calc(${(props) => props.$left}% - ${(props) => props.$size * 0.25}px);
    transform: rotate(${(props) => props.$rotation}deg);
    box-shadow: 0 0 10px ${(props) => props.$color};
    z-index: 3;
`;

export const CleaningIcon = styled.div<{ $size: number; $top: number; $left: number; $rotation: number }>`
    position: absolute;
    top: ${(props) => props.$top}%;
    left: ${(props) => props.$left}%;
    font-size: ${(props) => props.$size}px;
    transform: rotate(${(props) => props.$rotation}deg);
    z-index: 5;
    animation: ${float} 5s ease-in-out infinite;
`;
