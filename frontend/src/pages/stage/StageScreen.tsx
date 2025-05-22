import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getMapStages, getClearedStages } from '../../api/maps';

const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 120px);
    padding: 20px;
    background: url('/src/assets/img/stage/${(props) => props.$mapTheme}.png') no-repeat center center;
    background-size: cover;
    position: relative;
    margin-top: 60px;
    margin-bottom: 60px;
`;

const StageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const StageCard = styled.div<{ $isLocked: boolean }>`
    background: rgba(255, 255, 255, ${(props) => (props.$isLocked ? '0.3' : '0.9')});
    border-radius: 20px;
    padding: 20px;
    aspect-ratio: 16/9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: ${(props) => (props.$isLocked ? 'not-allowed' : 'pointer')};
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: ${(props) => (props.$isLocked ? 'none' : 'translateY(-5px)')};
        box-shadow: ${(props) => (props.$isLocked ? 'none' : '0 10px 20px rgba(0,0,0,0.2)')};
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

const StageTitle = styled.h3`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
    position: relative;
    z-index: 2;
`;

const StageInfo = styled.div`
    font-size: 1rem;
    color: #666;
    position: relative;
    z-index: 2;
`;

const StarContainer = styled.div`
    display: flex;
    gap: 5px;
    margin-top: 10px;
`;

const Star = styled.div<{ $filled: boolean }>`
    width: 20px;
    height: 20px;
    background: ${(props) => (props.$filled ? '#FFD700' : '#ccc')};
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
`;

const LockOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    font-size: 2rem;
    z-index: 3;
`;

interface StageInfo {
    stage_idx: number;
    stage_name: string;
    stage_mission: string;
    is_final_stage: string;
    stage_step: number;
}

export const StageScreen = () => {
    const { mapId } = useParams();
    const [stages, setStages] = useState<StageInfo[]>([]);
    const [clearedStages, setClearedStages] = useState<number[]>([]);
    const [unlockedStages, setUnlockedStages] = useState<number[]>([]);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const stagesResponse = await getMapStages(Number(mapId));
                setStages(stagesResponse.data);

                const email = localStorage.getItem('email');
                if (email) {
                    const clearedResponse = await getClearedStages(Number(mapId), email);
                    setClearedStages(clearedResponse.data.map((stage) => stage.stage_idx));
                }
            } catch (error) {
                console.error('스테이지 정보 로딩 실패:', error);
            }
        };

        fetchStages();
    }, [mapId]);

    useEffect(() => {
        // 첫 스테이지는 기본적으로 잠겨있음
        const unlocked = stages
            .filter((stage) => clearedStages.includes(stage.stage_idx - 1))
            .map((stage) => stage.stage_idx);
        setUnlockedStages(unlocked);
    }, [stages, clearedStages]);

    return (
        <Container $mapTheme={mapId === '1' ? 'trash-island' : mapId === '2' ? 'metal-land' : 'smoge-factory'}>
            <StageGrid>
                {stages.map((stage) => (
                    <StageCard
                        key={stage.stage_idx}
                        $isLocked={!unlockedStages.includes(stage.stage_idx)}
                    >
                        <StageTitle>{stage.stage_name}</StageTitle>
                        <StageInfo>
                            <div>{JSON.parse(stage.stage_mission).mission}</div>
                            <StarContainer>
                                {[1, 2, 3].map((star) => (
                                    <Star
                                        key={star}
                                        $filled={clearedStages.includes(stage.stage_idx)}
                                    />
                                ))}
                            </StarContainer>
                        </StageInfo>
                        {!unlockedStages.includes(stage.stage_idx) && (
                            <LockOverlay>
                                <span>🔒</span>
                            </LockOverlay>
                        )}
                    </StageCard>
                ))}
            </StageGrid>
        </Container>
    );
};
