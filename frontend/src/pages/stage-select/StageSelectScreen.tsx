import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getMapStages, getClearedStages } from '@/api/maps';
import { getStagePollutions, PollutionData } from '@/api/stages';
import { getEquippedSliceSkin, getEquippedTapSkin, UserSkinData } from '@/api/skins';
import StageInfoModal from '@/components/modal/StageInfoModal';

// 배경 이미지 import
import trashIsland from '@/assets/img/stage/trash-island.png';
import metalLand from '@/assets/img/stage/metal-land.png';
import smogeCity from '@/assets/img/stage/smoge-city.png';
import beginIcon from '@/assets/img/stage/begin.png';
import lockerIcon from '@/assets/img/stage/locker.png';
import fireIcon from '@/assets/img/stage/fire.png';
import waveIcon from '@/assets/img/stage/wave.png';

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
    isFinalStage: 'Y' | 'N';
    stageStep: number;
}

interface ProcessedStageInfo extends Omit<StageInfo, 'stageMission'> {
    stageMission: StageMission;
    unlocked: boolean;
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
    min-height: 100vh;
    padding: 20px;
    background: ${(props) => getBackgroundImage(props.$mapTheme)} no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: calc(3rem + 20px);
    padding-bottom: calc(3rem + 20px);
`;

const StageGrid = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    min-width: 320px;
    padding: 0 1rem;
    margin-bottom: 2rem;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
    }
`;

const StageCard = styled.div<{ $unlocked: boolean }>`
    background: ${({ $unlocked }) =>
        $unlocked
            ? 'linear-gradient(135deg, rgba(40,60,40,0.85) 0%, rgba(80,120,80,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(60,60,60,0.7) 0%, rgba(30,30,30,0.6) 100%)'};
    border-radius: 18px;
    padding: clamp(35px, 4vw, 45px) clamp(25px, 3vw, 35px) clamp(20px, 2vw, 28px) clamp(25px, 3vw, 35px);
    width: 100%;
    min-height: clamp(140px, 20vh, 180px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    position: relative;
    overflow: hidden;
    border: 2.5px solid ${({ $unlocked }) => ($unlocked ? 'rgba(120,255,120,0.18)' : 'rgba(120,120,120,0.12)')};
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18), 0 1.5px 0.5px 0 rgba(120, 255, 120, 0.08) inset;
    backdrop-filter: blur(8px);

    @media (min-width: 768px) {
        min-height: clamp(160px, 22vh, 200px);
    }

    @media (min-width: 1024px) {
        min-height: clamp(180px, 25vh, 220px);
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        z-index: 1;
        pointer-events: none;
        animation: shine 2.5s linear infinite;
    }

    @keyframes shine {
        0% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.7;
        }
    }
`;

const StageName = styled.h2`
    color: #fff;
    font-size: clamp(1.3rem, 3vw, 1.8rem);
    font-weight: 700;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.32), 0 0.5px 0 #222;
`;

const StageDescription = styled.p`
    color: #e0ffe0;
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
    opacity: 0.96;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.22);
    line-height: 1.4;
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: clamp(6px, 1.2vw, 10px) clamp(12px, 2.2vw, 18px);
    border-radius: 16px;
    font-size: clamp(1rem, 2vw, 1.3rem);
    font-weight: 600;
    background: ${({ $difficulty }) => $difficulty + '22'};
    color: ${({ $difficulty }) => $difficulty};
    border: 1.5px solid ${({ $difficulty }) => $difficulty + '66'};
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 2;
    margin-top: auto;
`;

const LockedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    backdrop-filter: blur(2px);
    z-index: 3;
`;

const StageSelectScreen: React.FC = () => {
    const { mapId } = useParams();
    const navigate = useNavigate();
    const [stages, setStages] = useState<ProcessedStageInfo[]>([]);
    const [clearedStages, setClearedStages] = useState<number[]>([]);
    const [selectedStage, setSelectedStage] = useState<ProcessedStageInfo | null>(null);
    const [pollutions, setPollutions] = useState<PollutionData[]>([]);
    const [equippedSkins, setEquippedSkins] = useState<{
        slice: UserSkinData | null;
        tap: UserSkinData | null;
    }>({
        slice: null,
        tap: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log('useEffect 실행됨, mapId:', mapId);
        const fetchStages = async () => {
            try {
                console.log('현재 선택된 맵 ID:', mapId);
                const stagesResponse = await getMapStages(Number(mapId));
                console.log('API 응답 전체:', stagesResponse);
                console.log('스테이지 목록 원본:', stagesResponse.stagelist);

                const email = localStorage.getItem('email');
                let clearedStagesList: number[] = [];
                if (email) {
                    const clearedResponse = await getClearedStages(Number(mapId), email);
                    console.log('클리어한 스테이지 응답:', clearedResponse);
                    clearedStagesList = clearedResponse.stagelist?.map((stage: StageInfo) => stage.stageIdx) || [];
                    setClearedStages(clearedStagesList);
                }

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
                                isFinalStage: stage.isFinalStage as 'Y' | 'N',
                                unlocked: stage.stageIdx === 1 || clearedStagesList.includes(stage.stageIdx),
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
                                isFinalStage: stage.isFinalStage as 'Y' | 'N',
                                unlocked: stage.stageIdx === 1 || clearedStagesList.includes(stage.stageIdx),
                            };
                        }
                    }) || [];

                console.log('최종 처리된 스테이지 목록:', processedStages);
                setStages(processedStages);
            } catch (error) {
                console.error('스테이지 정보 로딩 실패:', error);
            }
        };

        fetchStages();
        fetchEquippedSkins();
    }, [mapId]);

    const fetchEquippedSkins = async () => {
        console.log('fetchEquippedSkins 호출됨');
        const email = localStorage.getItem('email');
        console.log('fetchEquippedSkins email:', email);
        if (!email) {
            console.error('로그인 정보가 없습니다.');
            return;
        }
        try {
            console.log('getEquippedSliceSkin 호출');
            const slice = await getEquippedSliceSkin(email);
            console.log('getEquippedSliceSkin 응답:', slice);
            console.log('getEquippedTapSkin 호출');
            const tap = await getEquippedTapSkin(email);
            console.log('getEquippedTapSkin 응답:', tap);
            setEquippedSkins({ slice, tap });
        } catch (error) {
            console.error('장착된 스킨 조회 실패:', error);
        }
    };

    const handleStageSelect = async (stageIdx: number) => {
        const stage = stages.find((s) => s.stageIdx === stageIdx);
        if (!stage) return;

        console.log('선택된 스테이지:', stage);
        setSelectedStage(stage);
        try {
            const response = await getStagePollutions(stage.stageIdx);
            console.log('오염물 응답:', response);
            if (response.success && response.pollutionsList) {
                console.log('설정할 오염물 데이터:', response.pollutionsList);
                setPollutions(response.pollutionsList);
                setIsModalOpen(true);
                console.log('모달 상태:', {
                    isModalOpen: true,
                    selectedStage: stage,
                    pollutions: response.pollutionsList,
                    equippedSkins: equippedSkins,
                });
            }
        } catch (error) {
            console.error('스테이지 오염물 조회 실패:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStage(null);
    };

    const handleChangeSkin = () => {
        navigate('/inventory');
    };

    const handleStartGame = () => {
        if (selectedStage) {
            navigate(`/game/${selectedStage.stageIdx}`);
        }
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
                {stages.map((stage) => {
                    const difficulty = getDifficultyColor(stage.stageStep);
                    let diffIcon = null;
                    if (stage.stageStep === 1) diffIcon = beginIcon;
                    else if (stage.stageStep === 2) diffIcon = waveIcon;
                    else if (stage.stageStep === 3) diffIcon = fireIcon;
                    return (
                        <StageCard
                            key={`stage-${stage.stageIdx}`}
                            $unlocked={stage.stageIdx === 1 || clearedStages.includes(stage.stageIdx)}
                            onClick={() =>
                                (stage.stageIdx === 1 || clearedStages.includes(stage.stageIdx)) &&
                                handleStageSelect(stage.stageIdx)
                            }
                        >
                            <div>
                                <StageName>{stage.stageName}</StageName>
                                <StageDescription>{stage.stageMission.mission}</StageDescription>
                            </div>
                            <DifficultyBadge
                                $difficulty={difficulty}
                                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                            >
                                {diffIcon && (
                                    <img
                                        src={diffIcon}
                                        alt='난이도'
                                        style={{ width: 22, height: 22, marginRight: 6 }}
                                    />
                                )}
                                {getDifficultyText(stage.stageStep)}
                            </DifficultyBadge>
                            {stage.stageIdx !== 1 && !clearedStages.includes(stage.stageIdx) && (
                                <LockedOverlay>
                                    <img
                                        src={lockerIcon}
                                        alt='잠김'
                                        style={{ width: 48, height: 48 }}
                                    />
                                </LockedOverlay>
                            )}
                        </StageCard>
                    );
                })}
            </StageGrid>
            {(() => {
                console.log('렌더링 시점 모달 상태:', { selectedStage, isModalOpen, pollutions });
                return selectedStage && isModalOpen && pollutions.length > 0 ? (
                    <StageInfoModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        stageInfo={selectedStage}
                        pollutions={pollutions}
                        equippedSkins={equippedSkins}
                        onChangeSkin={handleChangeSkin}
                        onStartGame={handleStartGame}
                    />
                ) : null;
            })()}
        </Container>
    );
};

export default StageSelectScreen;
