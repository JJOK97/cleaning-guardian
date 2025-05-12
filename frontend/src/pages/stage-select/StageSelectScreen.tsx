import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';

interface Stage {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'normal' | 'hard';
    unlocked: boolean;
    stars: number;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    margin-bottom: 1rem;
`;

const StageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
`;

const StageCard = styled.div<{ $unlocked: boolean }>`
    position: relative;
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 16px;
    padding: 1.5rem;
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    transition: transform 0.2s ease;

    &:hover {
        transform: ${({ $unlocked }) => ($unlocked ? 'translateY(-5px)' : 'none')};
    }
`;

const StageName = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
`;

const StageDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1rem;
    margin-bottom: 1rem;
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    background-color: ${({ $difficulty, theme }) => {
        switch ($difficulty) {
            case 'easy':
                return theme.colors.primary.main;
            case 'normal':
                return theme.colors.secondary.main;
            case 'hard':
                return theme.colors.error.main;
            default:
                return theme.colors.background.light;
        }
    }};
    color: white;
`;

const LockedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
`;

const Stars = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const stages: Record<string, Stage[]> = {
    ocean: [
        {
            id: '1',
            name: '해변의 쓰레기',
            description: '해변에 쌓인 플라스틱 쓰레기를 정화하세요',
            difficulty: 'easy',
            unlocked: true,
            stars: 0,
        },
        {
            id: '2',
            name: '깊은 바다',
            description: '깊은 바다 속의 오염물질을 제거하세요',
            difficulty: 'normal',
            unlocked: true,
            stars: 0,
        },
        {
            id: '3',
            name: '해저 유적',
            description: '고대 유적지의 오염물질을 정화하세요',
            difficulty: 'hard',
            unlocked: false,
            stars: 0,
        },
    ],
    forest: [
        {
            id: '4',
            name: '숲속 오솔길',
            description: '숲속 오솔길의 쓰레기를 정화하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
        {
            id: '5',
            name: '깊은 숲',
            description: '깊은 숲 속의 오염물질을 제거하세요',
            difficulty: 'normal',
            unlocked: false,
            stars: 0,
        },
        {
            id: '6',
            name: '고대 나무',
            description: '고대 나무 주변의 오염물질을 정화하세요',
            difficulty: 'hard',
            unlocked: false,
            stars: 0,
        },
    ],
    city: [
        {
            id: '7',
            name: '도시 공원',
            description: '도시 공원의 쓰레기를 정화하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
        {
            id: '8',
            name: '고층 빌딩',
            description: '고층 빌딩 주변의 오염물질을 제거하세요',
            difficulty: 'normal',
            unlocked: false,
            stars: 0,
        },
        {
            id: '9',
            name: '지하철',
            description: '지하철의 오염물질을 정화하세요',
            difficulty: 'hard',
            unlocked: false,
            stars: 0,
        },
    ],
};

const StageSelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();
    const mapStages = stages[mapId || ''] || [];

    const handleStageSelect = (stageId: string) => {
        console.log('Selected stage:', stageId);
        navigate(`/game/${stageId}`);
    };

    const getDifficultyText = (difficulty: 'easy' | 'normal' | 'hard') => {
        switch (difficulty) {
            case 'easy':
                return '쉬움';
            case 'normal':
                return '보통';
            case 'hard':
                return '어려움';
        }
    };

    return (
        <Container>
            <Title>스테이지 선택</Title>
            <StageGrid>
                {mapStages.map((stage) => (
                    <StageCard
                        key={stage.id}
                        $unlocked={stage.unlocked}
                        onClick={() => stage.unlocked && handleStageSelect(stage.id)}
                    >
                        <StageName>{stage.name}</StageName>
                        <StageDescription>{stage.description}</StageDescription>
                        <DifficultyBadge $difficulty={stage.difficulty}>
                            {getDifficultyText(stage.difficulty)}
                        </DifficultyBadge>
                        {!stage.unlocked && <LockedOverlay>🔒</LockedOverlay>}
                        <Stars>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <span key={i}>{i < stage.stars ? '⭐' : '☆'}</span>
                            ))}
                        </Stars>
                    </StageCard>
                ))}
            </StageGrid>
        </Container>
    );
};

export default StageSelectScreen;
