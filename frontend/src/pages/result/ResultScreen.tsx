import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { GameResult } from '@/types/game';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 2rem;
`;

const ResultCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    margin-bottom: 1.5rem;
`;

const Score = styled.div`
    font-size: 3rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary.main};
    margin: 1rem 0;
`;

const Stats = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
`;

const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state as GameResult;

    const handleRetry = () => {
        navigate(`/game/${result.stageId}`);
    };

    const handleMainMenu = () => {
        navigate('/main');
    };

    return (
        <Container>
            <ResultCard>
                <Title>게임 결과</Title>
                <Score>{result.score}점</Score>
                <Stats>
                    <StatItem>
                        <span>스테이지</span>
                        <span>{result.stageId}</span>
                    </StatItem>
                    <StatItem>
                        <span>소요 시간</span>
                        <span>{result.timeSpent}초</span>
                    </StatItem>
                    <StatItem>
                        <span>제거한 오염물질</span>
                        <span>{result.pollutantsRemoved}개</span>
                    </StatItem>
                </Stats>
                <ButtonGroup>
                    <Button
                        $variant='primary'
                        onClick={handleRetry}
                    >
                        다시 도전
                    </Button>
                    <Button
                        $variant='secondary'
                        onClick={handleMainMenu}
                    >
                        메인 메뉴
                    </Button>
                </ButtonGroup>
            </ResultCard>
        </Container>
    );
};

export default ResultScreen;
