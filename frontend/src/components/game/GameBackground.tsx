import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.background.dark} 0%,
        ${({ theme }) => theme.colors.background.main} 100%
    );
    overflow: hidden;
`;

const Particles = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
`;

const Particle = styled.div<{ size: number; x: number; y: number; delay: number }>`
    position: absolute;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    background-color: ${({ theme }) => theme.colors.text.primary};
    border-radius: 50%;
    left: ${({ x }) => x}%;
    top: ${({ y }) => y}%;
    animation: float 3s ease-in-out infinite;
    animation-delay: ${({ delay }) => delay}s;

    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
        100% {
            transform: translateY(0) rotate(360deg);
        }
    }
`;

const BackgroundElement = styled.div<{ $delay: number }>`
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.5s ease;
    transition-delay: ${({ $delay }) => $delay}s;

    &.visible {
        opacity: 1;
    }
`;

const GameBackground: React.FC = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
    }));

    return (
        <Background>
            <Particles>
                {particles.map((particle, index) => (
                    <Particle
                        key={index}
                        size={particle.size}
                        x={particle.x}
                        y={particle.y}
                        delay={particle.delay}
                    />
                ))}
            </Particles>
        </Background>
    );
};

export default GameBackground;
