import styled, { css } from 'styled-components';
import { waveAnimation, fadeIn, scaleIn, shakeAnimation, floatMapAnimation, lockAnimation } from './animations';
import waveBg from '@/assets/img/background/wave.png';

export const BackgroundWave = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background-image: url(${waveBg});
    background-repeat: repeat-x;
    background-size: auto 100%;
    background-position: center;
    animation: ${waveAnimation} 10s ease-in-out infinite;
    z-index: 0;
`;

export const Container = styled.div`
    position: relative;
    height: 100vh;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.background.main} 0%,
        ${({ theme }) => theme.colors.background.light} 100%
    );
    overflow: hidden;
    perspective: 1000px;
`;

export const ScrollContainer = styled.div`
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    height: 300vh;
`;

export const MapGrid = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

export const MapContainer = styled.div<{ $index: number }>`
    position: absolute;
    top: ${({ $index }) => $index * 100}vh;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    padding: 2rem;
`;

export const MapContentWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10vh;
`;

export const MapImage = styled.img<{ $unlocked: boolean }>`
    width: auto;
    height: clamp(25vh, 35vh, 45vh);
    object-fit: contain;
    filter: ${({ $unlocked }) => ($unlocked ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' : 'grayscale(1) brightness(0.7)')};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${scaleIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
        height: clamp(30vh, 40vh, 50vh);
    }

    @media (min-width: 1024px) {
        height: clamp(35vh, 45vh, 55vh);
    }
`;

export const FactoryMapImage = styled(MapImage)`
    height: 45vh;
    cursor: pointer;
    animation: ${floatMapAnimation} 8s ease-in-out infinite;
    transform-origin: center center;
    will-change: transform;

    &:hover {
        animation-play-state: paused;
        transform: scale(1.03) translateY(-15px);
    }

    @media (min-width: 768px) {
        height: 50vh;
    }

    @media (min-width: 1024px) {
        height: 55vh;
    }
`;

export const DefaultMapImage = styled(MapImage)`
    height: 35vh;
    cursor: pointer;
    animation: ${floatMapAnimation} 6s ease-in-out infinite;
    transform-origin: center center;
    will-change: transform;

    &:hover {
        animation-play-state: paused;
        transform: scale(1.02) translateY(-10px);
    }

    @media (min-width: 768px) {
        height: 40vh;
    }

    @media (min-width: 1024px) {
        height: 45vh;
    }
`;

export const MapNameWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 1rem;

    @media (min-width: 768px) {
        padding: 0 2rem;
    }

    @media (min-width: 1024px) {
        padding: 0 3rem;
    }
`;

export const MapName = styled.h2`
    font-size: clamp(2rem, 5vw, 4rem);
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    margin: 0;
    text-align: center;
    line-height: 1.2;
    letter-spacing: -0.02em;

    @media (min-width: 768px) {
        letter-spacing: -0.03em;
    }

    @media (min-width: 1024px) {
        letter-spacing: -0.04em;
    }
`;

export const InfoIcon = styled.button`
    width: clamp(32px, 5vw, 48px);
    height: clamp(32px, 5vw, 48px);
    border-radius: 50%;
    border: 2px solid white;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    position: absolute;
    top: 0;
    right: 0.5rem;
    z-index: 2;
    animation: ${shakeAnimation} 3s ease-in-out infinite;
    backdrop-filter: blur(4px);

    @media (min-width: 768px) {
        width: clamp(40px, 6vw, 56px);
        height: clamp(40px, 6vw, 56px);
        font-size: clamp(1.3rem, 3vw, 1.8rem);
        right: 1.5rem;
    }

    @media (min-width: 1024px) {
        width: clamp(48px, 7vw, 64px);
        height: clamp(48px, 7vw, 64px);
        font-size: clamp(1.5rem, 3.5vw, 2rem);
        right: 2rem;
        border-width: 3px;
    }

    &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
        animation: none;
    }

    &:active {
        transform: scale(0.95);
    }
`;

export const StartButtonContainer = styled.div`
    position: fixed;
    bottom: calc(7.2rem + 1rem);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: clamp(280px, 90%, 400px);
    display: flex;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom);
`;

export const StartButton = styled.button<{ $unlocked: boolean }>`
    width: 100%;
    padding: clamp(1rem, 3vw, 1.2rem);
    font-size: clamp(1.2rem, 4vw, 1.4rem);
    font-weight: bold;
    border-radius: 30px;
    border: none;
    background: ${({ $unlocked }) =>
        $unlocked
            ? `linear-gradient(135deg, 
                rgba(76, 175, 80, 0.95) 0%,
                rgba(104, 195, 108, 0.95) 50%,
                rgba(129, 199, 132, 0.95) 100%
              )`
            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))'};
    color: ${({ $unlocked }) => ($unlocked ? 'white' : 'rgba(255, 255, 255, 0.6)')};
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $unlocked }) =>
        $unlocked
            ? `0 4px 12px rgba(76, 175, 80, 0.3),
               inset 0 2px 4px rgba(255, 255, 255, 0.4),
               inset 0 -2px 4px rgba(0, 0, 0, 0.2),
               0 0 0 2px rgba(255, 255, 255, 0.1)`
            : 'none'};
    backdrop-filter: blur(5px);
    text-shadow: ${({ $unlocked }) => ($unlocked ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none')};
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform: perspective(1000px) translateZ(0);
    transform-style: preserve-3d;
    max-width: clamp(280px, 80vw, 400px);
    margin: 0 auto;

    ${({ $unlocked }) =>
        $unlocked &&
        css`
            &:hover {
                transform: perspective(1000px) translateZ(10px) scale(1.02);
                box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                    0 0 0 3px rgba(255, 255, 255, 0.2);
                background: linear-gradient(135deg, rgba(76, 175, 80, 1) 0%, rgba(104, 195, 108, 1) 50%, rgba(129, 199, 132, 1) 100%);
                letter-spacing: 3px;
            }

            &:active {
                transform: perspective(1000px) translateZ(-5px) scale(0.98);
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.4),
                    0 0 0 2px rgba(255, 255, 255, 0.1);
                background: linear-gradient(135deg, rgba(69, 160, 73, 1) 0%, rgba(76, 175, 80, 1) 50%, rgba(104, 195, 108, 1) 100%);
                letter-spacing: 2px;
            }
        `}

    &::before {
        content: '🔒';
        font-size: clamp(1.1rem, 3.5vw, 1.3rem);
        opacity: ${({ $unlocked }) => ($unlocked ? 0 : 0.6)};
        transform: ${({ $unlocked }) => ($unlocked ? 'scale(0)' : 'scale(1)')};
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: ${({ $unlocked }) => ($unlocked ? 'absolute' : 'relative')};
        visibility: ${({ $unlocked }) => ($unlocked ? 'hidden' : 'visible')};
        animation: ${({ $unlocked }) =>
            !$unlocked &&
            css`
                ${lockAnimation} 2s ease-in-out infinite
            `};
    }
`;
export const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
    z-index: 1000;

    h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    p {
        margin: 0.5rem 0 0;
        font-size: 1rem;
        opacity: 0.8;
    }
`;

export const NextChallengeSection = styled.div`
    margin-top: 5rem;
    padding: 1rem;
    text-align: center;
    color: white;

    h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
`;

export const MapCard = styled.div<{ $isCleared: boolean }>`
    background: ${({ $isCleared }) =>
        $isCleared
            ? 'linear-gradient(135deg, rgba(40,60,40,0.85) 0%, rgba(80,120,80,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(60,60,60,0.7) 0%, rgba(30,30,30,0.6) 100%)'};
    border-radius: 18px;
    padding: 1.5rem;
    margin: 1rem auto;
    max-width: 600px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.02);
    }
`;

export const MapTitle = styled.h3`
    color: white;
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
`;

export const MapDescription = styled.p`
    color: #e0ffe0;
    font-size: 1rem;
    margin: 0;
    opacity: 0.9;
`;
