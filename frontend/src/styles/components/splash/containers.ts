import styled from 'styled-components';
import { fadeIn, pulse } from './animations';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: radial-gradient(ellipse at center, #1a2a6c 0%, #0a0a2a 70%, #000000 100%);
    position: relative;
    overflow: hidden;
`;

export const LoadingBarContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    overflow: hidden;
    z-index: 20;
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const LoadingBarProgress = styled.div<{ $progress: number }>`
    height: 100%;
    width: ${(props) => props.$progress}%;
    background: linear-gradient(90deg, #4caf50, #81c784);
    border-radius: 5px;
    transition: width 0.3s ease;
`;

export const LoadingText = styled.div`
    position: absolute;
    top: calc(50% + 15px);
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    text-align: center;
    z-index: 20;
    font-family: 'AppleSDGothicNeo', 'Noto Sans KR', sans-serif;
`;

export const TapToStart = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    width: 250px;
    padding: 15px 0;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    z-index: 30;
    animation: ${fadeIn} 0.5s ease-in-out, ${pulse} 2s ease-in-out infinite;
    text-align: center;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
    font-family: 'AppleSDGothicNeo', 'Noto Sans KR', sans-serif;
    font-size: 1rem;

    &:hover,
    &:active {
        background: rgba(76, 175, 80, 0.2);
        border-color: rgba(76, 175, 80, 0.5);
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
    }
`;
