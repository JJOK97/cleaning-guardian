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

const stages: Record<string, Stage[]> = {
    ocean: [
        {
            id: 'ocean-1',
            name: '해변가',
            description: '플라스틱 병과 비닐봉지를 제거하세요',
            difficulty: 'easy',
            unlocked: true,
            stars: 0,
        },
        {
            id: 'ocean-2',
            name: '얕은 바다',
            description: '플라스틱 빨대와 일회용 컵을 제거하세요',
            difficulty: 'normal',
            unlocked: false,
            stars: 0,
        },
        {
            id: 'ocean-3',
            name: '깊은 바다',
            description: '어망과 플라스틱 조각을 제거하세요',
            difficulty: 'hard',
            unlocked: false,
            stars: 0,
        },
    ],
    forest: [
        {
            id: 'forest-1',
            name: '숲 입구',
            description: '일회용 쓰레기를 제거하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
    ],
    city: [
        {
            id: 'city-1',
            name: '도시 공원',
            description: '미세먼지를 제거하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
    ],
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    text-align: center;
`;

const StageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
`;

const StageCard = styled.div<{ $unlocked: boolean }>`
    background-color: ${({ theme, $unlocked }) =>
        $unlocked ? theme.colors.background.card : theme.colors.background.dark};
    border-radius: 12px;
    padding: 1.5rem;
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: ${({ $unlocked }) => ($unlocked ? 'translateY(-4px)' : 'none')};
        box-shadow: ${({ $unlocked }) => ($unlocked ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none')};
    }
`;

const StageIcon = styled.div`
    font-size: 3rem;
`;

const StageName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
`;

const StageDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    background-color: ${({ theme, $difficulty }) => {
        switch ($difficulty) {
            case 'easy':
                return theme.colors.primary.light;
            case 'normal':
                return theme.colors.secondary.main;
            case 'hard':
                return theme.colors.error.main;
            default:
                return theme.colors.primary.light;
        }
    }};
    color: white;
`;

const LockedLabel = styled.div`
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
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

const StageSelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();
    const mapStages = stages[mapId || ''] || [];

    const handleStageSelect = (stageId: string) => {
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
                        <StageIcon>🎯</StageIcon>
                        <StageName>{stage.name}</StageName>
                        <StageDescription>{stage.description}</StageDescription>
                        <DifficultyBadge $difficulty={stage.difficulty}>
                            {getDifficultyText(stage.difficulty)}
                        </DifficultyBadge>
                        {!stage.unlocked && <LockedOverlay>🔒</LockedOverlay>}
                        {stage.stars > 0 && (
                            <Stars>
                                {Array.from({ length: stage.stars }).map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </Stars>
                        )}
                    </StageCard>
                ))}
            </StageGrid>
            <ButtonGroup>
                <Button
                    $variant='secondary'
                    onClick={() => navigate('/main')}
                >
                    맵 선택으로
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default StageSelectScreen;
