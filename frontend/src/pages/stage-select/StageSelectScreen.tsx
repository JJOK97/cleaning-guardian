import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getMapStages, getClearedStages } from '@/api/maps';

// 배경 이미지 import
import trashIsland from '@/assets/img/stage/trash-island.png';
import metalLand from '@/assets/img/stage/metal-land.png';
import smogeCity from '@/assets/img/stage/smoge-city.png';

interface StageMission {
    mission: string;
    target: string;
    action: string;
}

interface StageInfo {
    stageIdx: number;
    mapIdx: number;
    stageName: string;
    stageMission: string;
    isFinalStage: string;
    stageStep: number;
}

interface ProcessedStageInfo extends Omit<StageInfo, 'stageMission'> {
    stageMission: StageMission;
}

const getBackgroundImage = (mapId: string) => {
    const mapIdx = Number(mapId);
    switch (mapIdx) {
        case 1:
            return `url(${trashIsland})`;
        case 2:
            return `url(${metalLand})`;
        case 3:
            return `url(${smogeCity})`;
        default:
            return 'none';
    }
};

const Container = styled.div<{ $mapTheme: string }>`
    width: 100%;
    min-height: calc(100vh - 120px);
    padding: 20px;
    background: ${(props) => getBackgroundImage(props.$mapTheme)} no-repeat center center;
    background-size: cover;
    position: relative;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StageGrid = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    width: 100%;
    max-width: 1200px;
`;

const StageCard = styled.div<{ $unlocked: boolean }>`
    background: rgba(255, 255, 255, ${(props) => (props.$unlocked ? '0.9' : '0.3')});
    border-radius: 20px;
    padding: 20px;
    aspect-ratio: 16/9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: ${(props) => (props.$unlocked ? 'pointer' : 'not-allowed')};
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: ${(props) => (props.$unlocked ? 'translateY(-5px)' : 'none')};
        box-shadow: ${(props) => (props.$unlocked ? '0 10px 20px rgba(0,0,0,0.2)' : 'none')};
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
        z-index: 1;
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
            case '#4CAF50':
                return theme.colors.primary.main;
            case '#2196F3':
                return theme.colors.secondary.main;
            case '#f44336':
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

const StageSelectScreen: React.FC = () => {
    const { mapId } = useParams();
    const [stages, setStages] = useState<ProcessedStageInfo[]>([]);
    const [clearedStages, setClearedStages] = useState<number[]>([]);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                console.log('현재 선택된 맵 ID:', mapId);
                const stagesResponse = await getMapStages(Number(mapId));
                console.log('API 응답 전체:', stagesResponse);
                console.log('스테이지 목록 원본:', stagesResponse.stagelist);

                const processedStages =
                    stagesResponse.stagelist?.map((stage: StageInfo) => {
                        console.log(`스테이지 처리 중:`, {
                            stageIdx: stage.stageIdx,
                            mapIdx: stage.mapIdx,
                            stageName: stage.stageName,
                            rawMission: stage.stageMission,
                        });
                        try {
                            const processed = {
                                ...stage,
                                stageMission: JSON.parse(stage.stageMission),
                            };
                            console.log('처리된 스테이지:', processed);
                            return processed;
                        } catch (error) {
                            console.error('스테이지 미션 파싱 실패:', stage.stageMission);
                            return {
                                ...stage,
                                stageMission: {
                                    mission: stage.stageName,
                                    target: '',
                                    action: '',
                                },
                            };
                        }
                    }) || [];

                console.log('최종 처리된 스테이지 목록:', processedStages);
                setStages(processedStages);

                const email = localStorage.getItem('email');
                if (email) {
                    const clearedResponse = await getClearedStages(Number(mapId), email);
                    console.log('클리어한 스테이지 응답:', clearedResponse);
                    setClearedStages(clearedResponse.stagelist?.map((stage: StageInfo) => stage.stageIdx) || []);
                }
            } catch (error) {
                console.error('스테이지 정보 로딩 실패:', error);
            }
        };

        fetchStages();
    }, [mapId]);

    const handleStageSelect = (stageIdx: number) => {
        console.log('Selected stage:', stageIdx);
        // Implement the logic to navigate to the game page
    };

    const getDifficultyText = (step: number) => {
        switch (step) {
            case 1:
                return '쉬움';
            case 2:
                return '보통';
            case 3:
                return '어려움';
            default:
                return '알 수 없음';
        }
    };

    const getDifficultyColor = (step: number) => {
        switch (step) {
            case 1:
                return '#4CAF50'; // 초록색 (쉬움)
            case 2:
                return '#2196F3'; // 파란색 (보통)
            case 3:
                return '#f44336'; // 빨간색 (어려움)
            default:
                return '#9E9E9E'; // 회색 (기본)
        }
    };

    return (
        <Container $mapTheme={mapId || ''}>
            <StageGrid>
                {stages.map((stage) => (
                    <StageCard
                        key={`stage-${stage.stageIdx}`}
                        $unlocked={clearedStages.includes(stage.stageIdx)}
                        onClick={() => clearedStages.includes(stage.stageIdx) && handleStageSelect(stage.stageIdx)}
                    >
                        <StageName>{stage.stageName}</StageName>
                        <StageDescription>{stage.stageMission.mission}</StageDescription>
                        <DifficultyBadge $difficulty={getDifficultyColor(stage.stageStep)}>
                            {getDifficultyText(stage.stageStep)}
                        </DifficultyBadge>
                        {!clearedStages.includes(stage.stageIdx) && <LockedOverlay>🔒</LockedOverlay>}
                    </StageCard>
                ))}
            </StageGrid>
        </Container>
    );
};

export default StageSelectScreen;
