import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMapDetail, getMapStages, getClearedStages, checkMapClear } from '@/api/maps';
import { checkStageClear } from '@/api/stages';
import { getUserInfo } from '@/api/user';
import { ProcessedMap } from '@/types/map';
import { getMapImage, getMapTitle } from '@/utils/mapUtils';
import {
    Container,
    MapInfoContainer,
    MapImage,
    MapTitle,
    MapDescription,
    StageGrid,
    StageContainer,
    StageContent,
    StageNumber,
    StageInfo,
    StageTitle,
    StageDescription,
    StartButton,
    BackButton,
    LockedOverlay,
    LockIcon,
} from '@/styles/StageSelectScreen.styles';

interface Stage {
    stageIdx: number;
    mapIdx: number;
    stageTitle: string;
    stageDesc: string;
    stageTheme: string;
    createdAt: string;
    unlocked: boolean;
}

interface StageResponse {
    success: boolean;
    message: string;
    stages?: Stage[];
}

const StageSelectScreen: React.FC = () => {
    const { mapIdx } = useParams<{ mapIdx: string }>();
    const navigate = useNavigate();
    const [map, setMap] = useState<ProcessedMap | null>(null);
    const [stages, setStages] = useState<Stage[]>([]);
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

    useEffect(() => {
        const fetchMapAndStages = async () => {
            try {
                const userInfo = await getUserInfo();
                if (!userInfo.success) {
                    console.error('유저 정보 조회 실패');
                    return;
                }

                // 맵 정보 가져오기
                const mapResponse = await getMapDetail(Number(mapIdx));
                if (!mapResponse.success || !mapResponse.map) {
                    console.error('맵 정보 조회 실패');
                    return;
                }

                const mapDetail = mapResponse.map;
                const parsedDesc = JSON.parse(mapDetail.mapDesc);
                const processedMap: ProcessedMap = {
                    mapIdx: mapDetail.mapIdx,
                    gameIdx: mapDetail.gameIdx,
                    mapTitle: getMapTitle(mapDetail.mapIdx),
                    mapTheme: mapDetail.mapTheme,
                    createdAt: mapDetail.createdAt,
                    map_desc: mapDetail.mapDesc,
                    mapDesc: parsedDesc,
                    unlocked: true,
                };
                setMap(processedMap);

                // 스테이지 목록 가져오기
                const stagesResponse = (await getMapStages(Number(mapIdx))) as StageResponse;
                if (!stagesResponse.success || !stagesResponse.stages) {
                    console.error('스테이지 목록 조회 실패');
                    return;
                }

                // 클리어한 스테이지 목록 가져오기
                const clearedResponse = (await getClearedStages(Number(mapIdx), userInfo.email)) as StageResponse;
                const clearedStages = clearedResponse.stages || [];

                // 각 스테이지의 오픈 상태 체크
                const processedStages = await Promise.all(
                    stagesResponse.stages.map(async (stage: Stage, index: number) => {
                        let isUnlocked = index === 0; // 첫 번째 스테이지는 항상 오픈

                        if (index > 0) {
                            // 이전 스테이지의 클리어 상태 체크
                            const prevStageClearInfo = await checkStageClear(stage.stageIdx - 1, userInfo.email);
                            if (prevStageClearInfo.success && prevStageClearInfo.clearInfo) {
                                isUnlocked = true;
                            }
                        }

                        return {
                            ...stage,
                            unlocked: isUnlocked,
                        };
                    }),
                );

                setStages(processedStages);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            }
        };

        fetchMapAndStages();
    }, [mapIdx]);

    const handleStageClick = (stage: Stage) => {
        if (stage.unlocked) {
            setSelectedStage(stage);
        }
    };

    const handleStartClick = () => {
        if (selectedStage) {
            navigate(`/game/${selectedStage.stageIdx}`);
        }
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    if (!map) {
        return <div>로딩 중...</div>;
    }

    return (
        <Container>
            <MapInfoContainer>
                <MapImage src={getMapImage(map.mapIdx)} alt={map.mapTitle} />
                <MapTitle>{map.mapTitle}</MapTitle>
                <MapDescription>{map.mapDesc.summary}</MapDescription>
            </MapInfoContainer>

            <StageGrid>
                {stages.map((stage) => (
                    <StageContainer key={stage.stageIdx} onClick={() => handleStageClick(stage)} $unlocked={stage.unlocked}>
                        <StageContent>
                            <StageNumber>Stage {stage.stageIdx}</StageNumber>
                            <StageInfo>
                                <StageTitle>{stage.stageTitle}</StageTitle>
                                <StageDescription>{stage.stageDesc}</StageDescription>
                            </StageInfo>
                            {!stage.unlocked && (
                                <LockedOverlay>
                                    <LockIcon>🔒</LockIcon>
                                </LockedOverlay>
                            )}
                        </StageContent>
                    </StageContainer>
                ))}
            </StageGrid>

            <StartButton onClick={handleStartClick} disabled={!selectedStage}>
                {selectedStage ? '시작하기' : '스테이지를 선택하세요'}
            </StartButton>

            <BackButton onClick={handleBackClick}>뒤로가기</BackButton>
        </Container>
    );
};

export default StageSelectScreen;
