import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../common/Button';

// 애니메이션 키프레임들
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 195, 247, 0.7);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 20px rgba(79, 195, 247, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 195, 247, 0);
    }
`;

const slideInFromLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const slideInFromRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const gradientShift = keyframes`
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

// 완전히 화면을 덮는 오버레이
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4fc3f7 100%);
    background-size: 400% 400%;
    animation: ${gradientShift} 8s ease infinite;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow: hidden;

    /* 배경 패턴 추가 */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        pointer-events: none;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    position: relative;
    z-index: 1;
`;

const GameLogo = styled.div`
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    text-align: center;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    margin-bottom: 1rem;
    animation: ${slideInFromLeft} 0.8s ease-out;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const StageCard = styled.div`
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    padding: 1.5rem;
    width: 100%;
    text-align: center;
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 1.2rem;
    }
`;

const StageTitle = styled.h1`
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 0.8rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 1.4rem;
        margin: 0 0 0.6rem 0;
    }
`;

const StageDescription = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 0;
    line-height: 1.4;
    word-break: keep-all;
    white-space: pre-line;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        line-height: 1.3;
    }
`;

const CountdownContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    animation: ${slideInFromRight} 0.8s ease-out 0.4s both;
`;

const CountdownText = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CountdownNumber = styled.div`
    color: white;
    font-size: 5rem;
    font-weight: 900;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    animation: ${pulse} 1s ease-in-out infinite;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);

    @media (max-width: 768px) {
        font-size: 4rem;
        width: 100px;
        height: 100px;
    }
`;

const StartButton = styled(Button)`
    font-size: 1.3rem;
    padding: 1rem 3rem;
    border-radius: 50px;
    background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
    border: none;
    color: white;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
    transition: all 0.3s ease;
    animation: ${fadeIn} 0.8s ease-out 0.6s both;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(79, 195, 247, 0.4);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        font-size: 1.1rem;
        padding: 0.8rem 2.5rem;
    }
`;

const LoadingIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    animation: ${fadeIn} 0.8s ease-out 0.8s both;
`;

const LoadingDots = styled.div`
    display: flex;
    gap: 4px;

    & > div {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: ${pulse} 1.4s ease-in-out infinite;

        &:nth-child(1) {
            animation-delay: 0s;
        }
        &:nth-child(2) {
            animation-delay: 0.2s;
        }
        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
`;

interface PassiveItem {
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
}

interface GamePreparationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (selectedItems: string[]) => void;
    stageInfo: {
        name: string;
        description: string;
        difficulty: 'easy' | 'normal' | 'hard';
    };
}

const passiveItems: PassiveItem[] = [
    {
        id: 'double-score',
        name: '점수 2배',
        description: '획득하는 점수가 2배가 됩니다',
        image: '⭐',
        selected: false,
    },
    {
        id: 'slow-time',
        name: '시간 감속',
        description: '게임 시간이 1.5배 느려집니다',
        image: '⏰',
        selected: false,
    },
    {
        id: 'extra-life',
        name: '추가 생명',
        description: '생명이 1개 추가됩니다',
        image: '❤️',
        selected: false,
    },
];

const GamePreparationModal: React.FC<GamePreparationModalProps> = ({ isOpen, onClose, onStart, stageInfo }) => {
    const [items, setItems] = useState<PassiveItem[]>(passiveItems);
    const [countdown, setCountdown] = useState(5); // 5초로 늘려서 배경 로딩 시간 확보
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // 2초 후에 준비 완료로 설정 (배경 로딩 시간 확보)
            const readyTimer = setTimeout(() => {
                setIsReady(true);
            }, 2000);

            return () => clearTimeout(readyTimer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && isReady && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (countdown === 0 && isReady) {
            const selectedItems = items.filter((item) => item.selected).map((item) => item.id);
            onStart(selectedItems);
        }
    }, [isOpen, countdown, onStart, items, isReady]);

    const toggleItem = (itemId: string) => {
        setItems(items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)));
    };

    const handleManualStart = () => {
        const selectedItems = items.filter((item) => item.selected).map((item) => item.id);
        onStart(selectedItems);
    };

    if (!isOpen) return null;

    return (
        <Overlay>
            <Container>
                <GameLogo>🌍 청소의 신</GameLogo>

                <StageCard>
                    <StageTitle>{stageInfo.name}</StageTitle>
                    <StageDescription>{stageInfo.description}</StageDescription>
                </StageCard>

                {!isReady ? (
                    <LoadingIndicator>
                        게임 준비 중
                        <LoadingDots>
                            <div></div>
                            <div></div>
                            <div></div>
                        </LoadingDots>
                    </LoadingIndicator>
                ) : countdown > 0 ? (
                    <CountdownContainer>
                        <CountdownText>게임 시작까지</CountdownText>
                        <CountdownNumber>{countdown}</CountdownNumber>
                    </CountdownContainer>
                ) : (
                    <StartButton onClick={handleManualStart}>🎮 게임 시작하기</StartButton>
                )}
            </Container>
        </Overlay>
    );
};

export default GamePreparationModal;
