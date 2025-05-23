import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

export const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 120px); // header(60px) + footer(60px) 고려
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: url('/src/assets/img/background/wave.png') no-repeat center center;
    background-size: 200% 100%;
    animation: ${waveAnimation} 20s linear infinite;
    margin-top: 60px; // header 높이만큼 여백
    margin-bottom: 60px; // footer 높이만큼 여백
`;

export const MapList = styled.div`
    width: 100%;
    height: calc(100vh - 180px); // header + footer + padding 고려
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    padding: 20px 0;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const EnterButton = styled.button<{ $isActive: boolean }>`
    position: fixed;
    bottom: 80px; // footer 높이 고려
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 40px;
    border-radius: 25px;
    border: none;
    background: ${(props) => (props.$isActive ? '#4CAF50' : '#ccc')};
    color: white;
    font-size: 1.2em;
    cursor: ${(props) => (props.$isActive ? 'pointer' : 'not-allowed')};
    transition: all 0.3s ease;
    z-index: 10;
`;

export const LoadingText = styled.div`
    font-size: 1.2em;
    color: #666;
    margin-top: 20px;
`;

export const ErrorText = styled.div`
    font-size: 1.2em;
    color: #ff4444;
    margin-top: 20px;
`;
