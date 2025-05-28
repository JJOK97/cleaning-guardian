import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션 키프레임들
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const slideUp = keyframes`
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
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: ${fadeIn} 0.5s ease-out;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    max-width: 380px;
    width: 90%;

    @media (max-width: 768px) {
        gap: 1.2rem;
        padding: 1.2rem;
    }
`;

const ResultIcon = styled.div<{ $isSuccess: boolean }>`
    font-size: 4rem;
    animation: ${fadeIn} 0.8s ease-out 0.2s both, ${pulse} 2s ease-in-out infinite;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: ${(props) =>
            props.$isSuccess
                ? 'radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(244, 67, 54, 0.3) 0%, transparent 70%)'};
        animation: ${pulse} 2s ease-in-out infinite;
        z-index: -1;
    }

    @media (max-width: 768px) {
        font-size: 3.5rem;

        &::before {
            width: 80px;
            height: 80px;
        }
    }
`;

const ResultTitle = styled.h1<{ $isSuccess: boolean }>`
    color: ${(props) => (props.$isSuccess ? '#4CAF50' : '#F44336')};
    font-size: 2.2rem;
    font-weight: 900;
    text-align: center;
    margin: 0;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: ${slideUp} 0.8s ease-out 0.4s both;

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const ResultMessage = styled.p`
    color: white;
    font-size: 1rem;
    text-align: center;
    margin: 0;
    line-height: 1.4;
    word-break: keep-all;
    animation: ${slideUp} 0.8s ease-out 0.6s both;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        line-height: 1.3;
    }
`;

const StatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
    animation: ${slideUp} 0.8s ease-out 0.8s both;
`;

const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0.8rem 1.2rem;
    color: white;
    font-size: 1rem;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.7rem 1rem;
        border-radius: 10px;
    }
`;

const StatLabel = styled.span`
    font-weight: 600;
`;

const StatValue = styled.span<{ $highlight?: boolean }>`
    font-weight: 700;
    color: ${(props) => (props.$highlight ? '#4CAF50' : 'white')};
`;

const CountdownText = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    text-align: center;
    animation: ${slideUp} 0.8s ease-out 1s both;
`;

interface GameEndTransitionProps {
    isVisible: boolean;
    isSuccess: boolean;
    score: number;
    defeatedCount: number;
    targetCount: number;
    timeSpent: number;
    onComplete: () => void;
}

const GameEndTransition: React.FC<GameEndTransitionProps> = ({
    isVisible,
    isSuccess,
    score,
    defeatedCount,
    targetCount,
    timeSpent,
    onComplete,
}) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!isVisible) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // 0.5초 후 결과 화면으로
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <Overlay>
            <Container>
                <ResultIcon $isSuccess={isSuccess}>{isSuccess ? '🎉' : '💥'}</ResultIcon>

                <ResultTitle $isSuccess={isSuccess}>{isSuccess ? '미션 성공!' : '미션 실패!'}</ResultTitle>

                <ResultMessage>{isSuccess ? '지구가 깨끗해졌어요!' : '다시 도전해보세요!'}</ResultMessage>

                <StatsContainer>
                    <StatItem>
                        <StatLabel>🏆 획득 점수</StatLabel>
                        <StatValue $highlight>{score.toLocaleString()}</StatValue>
                    </StatItem>

                    <StatItem>
                        <StatLabel>🎯 정화 완료</StatLabel>
                        <StatValue $highlight={defeatedCount >= targetCount}>
                            {defeatedCount} / {targetCount}
                        </StatValue>
                    </StatItem>

                    <StatItem>
                        <StatLabel>⏱️ 소요 시간</StatLabel>
                        <StatValue>{timeSpent}초</StatValue>
                    </StatItem>
                </StatsContainer>

                {countdown > 0 && <CountdownText>{countdown}초 후 결과 화면으로 이동합니다...</CountdownText>}
            </Container>
        </Overlay>
    );
};

export default GameEndTransition;
