import { keyframes } from 'styled-components';

export const waveAnimation = keyframes`
    0% {
        transform: translateX(-50%) translateY(0);
    }
    50% {
        transform: translateX(-30%) translateY(-10px);
    }
    100% {
        transform: translateX(-50%) translateY(0);
    }
`;

export const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const scaleIn = keyframes`
    from {
        transform: scale(0.95);
        opacity: 0.5;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
`;

export const shakeAnimation = keyframes`
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-10deg);
    }
    75% {
        transform: rotate(10deg);
    }
`;

export const floatMapAnimation = keyframes`
    0% {
        transform: translateY(0) rotate(0deg);
    }
    25% {
        transform: translateY(-5px) rotate(0.5deg);
    }
    75% {
        transform: translateY(3px) rotate(-0.5deg);
    }
    100% {
        transform: translateY(0) rotate(0deg);
    }
`;

export const lockAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

export const buttonAnimation = keyframes`
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
    100% {
        transform: translateY(0);
    }
`;
