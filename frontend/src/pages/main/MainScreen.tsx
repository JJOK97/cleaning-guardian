import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClearedMaps, getMapDetail } from '@/api/maps';
import { getUserInfo } from '@/api/user';
import MapInfoModal from '@/components/modal/MapInfoModal';
import { ProcessedMap } from '@/types/map';
import { getMapImage, getMapTitle } from '@/utils/mapUtils';
import {
    BackgroundWave,
    Container,
    ScrollContainer,
    ContentWrapper,
    MapGrid,
    MapContainer,
    MapContentWrapper,
    FactoryMapImage,
    DefaultMapImage,
    MapNameWrapper,
    MapName,
    InfoIcon,
    StartButtonContainer,
    StartButton,
} from '@/styles/MainScreen.styles';

const MainScreen: React.FC = () => {
    const navigate = useNavigate();
    const [maps, setMaps] = useState<ProcessedMap[]>([]);
    const [visibleMap, setVisibleMap] = useState<ProcessedMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<ProcessedMap | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const userInfo = await getUserInfo();
                if (!userInfo.success) {
                    console.error('유저 정보 조회 실패');
                    return;
                }

                const clearedResponse = await getClearedMaps(userInfo.email);
                console.log('클리어한 맵 응답 전체:', clearedResponse);
                console.log('클리어한 맵 목록 원본:', clearedResponse.maplist);

                if (!clearedResponse.success) {
                    console.error('API 요청 실패');
                    return;
                }

                const mapList = clearedResponse.maplist;
                const clearedMaps = clearedResponse.maplist;

                if (!Array.isArray(mapList)) {
                    console.error('맵 데이터가 배열이 아님');
                    return;
                }

                console.log('원본 맵 목록:', mapList);
                const processedMaps = mapList.map((map) => {
                    console.log('맵 처리 중:', {
                        mapIdx: map.mapIdx,
                        mapTheme: map.mapTheme,
                        mapTitle: map.mapTitle,
                    });
                    const parsedDesc = JSON.parse(map.mapDesc);
                    const isUnlocked =
                        map.mapIdx === 1 || clearedMaps.some((clearedMap) => clearedMap.mapIdx === map.mapIdx);

                    const processed = {
                        mapIdx: map.mapIdx,
                        gameIdx: map.gameIdx,
                        mapTitle: map.mapTitle,
                        mapTheme: map.mapTheme,
                        createdAt: map.createdAt,
                        map_desc: map.mapDesc,
                        mapDesc: parsedDesc,
                        unlocked: isUnlocked,
                    } as ProcessedMap;
                    console.log('처리된 맵:', processed);
                    return processed;
                });

                console.log('최종 처리된 맵 목록:', processedMaps);
                setMaps(processedMaps);
                setVisibleMap(processedMaps[0]);
            } catch (error) {
                console.error('맵 데이터 로딩 실패:', error);
            }
        };

        fetchMaps();
    }, []);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const mapIndex = Math.round(scrollTop / viewportHeight);
        if (maps[mapIndex] && visibleMap !== maps[mapIndex]) {
            setVisibleMap(maps[mapIndex]);
        }
    };

    const handleInfoClick = async (e: React.MouseEvent, map: ProcessedMap) => {
        e.stopPropagation();
        try {
            const response = await getMapDetail(map.mapIdx);
            console.log('맵 상세 정보:', response);

            if (!response.success || !response.map) {
                console.error('맵 상세 정보 조회 실패');
                return;
            }

            const mapDetail = response.map;
            const parsedDesc = JSON.parse(mapDetail.mapDesc);
            const processedDetail: ProcessedMap = {
                mapIdx: mapDetail.mapIdx,
                gameIdx: mapDetail.gameIdx,
                mapTitle: getMapTitle(mapDetail.mapIdx),
                mapTheme: mapDetail.mapTheme,
                createdAt: mapDetail.createdAt,
                map_desc: mapDetail.mapDesc,
                mapDesc: parsedDesc,
                unlocked: map.unlocked,
            };

            setSelectedMap(processedDetail);
            setIsModalOpen(true);
        } catch (error) {
            console.error('맵 상세 정보 로딩 실패:', error);
        }
    };

    const handleStartClick = () => {
        if (visibleMap?.unlocked) {
            console.log('현재 선택된 맵 정보:', {
                mapIdx: visibleMap.mapIdx,
                mapTitle: visibleMap.mapTitle,
                mapTheme: visibleMap.mapTheme,
            });
            console.log('스테이지 선택 화면으로 이동:', visibleMap.mapTitle);
            navigate(`/stage-select/${visibleMap.mapIdx}`);
        }
    };

    return (
        <Container>
            <BackgroundWave />
            <ScrollContainer
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                <ContentWrapper>
                    <MapGrid>
                        {maps.map((map, index) => (
                            <MapContainer
                                key={`map-${map.mapIdx}`}
                                $index={index}
                                onClick={() => setVisibleMap(map)}
                            >
                                <MapContentWrapper>
                                    <InfoIcon onClick={(e) => handleInfoClick(e, map)}>!</InfoIcon>
                                    {map.mapIdx === 3 ? (
                                        <FactoryMapImage
                                            src={getMapImage(map.mapIdx)}
                                            alt={getMapTitle(map.mapIdx)}
                                            $unlocked={map.unlocked}
                                        />
                                    ) : (
                                        <DefaultMapImage
                                            src={getMapImage(map.mapIdx)}
                                            alt={getMapTitle(map.mapIdx)}
                                            $unlocked={map.unlocked}
                                        />
                                    )}
                                    <MapNameWrapper>
                                        <MapName>{getMapTitle(map.mapIdx)}</MapName>
                                    </MapNameWrapper>
                                </MapContentWrapper>
                            </MapContainer>
                        ))}
                    </MapGrid>
                </ContentWrapper>
            </ScrollContainer>
            <StartButtonContainer>
                <StartButton
                    $unlocked={visibleMap?.unlocked || false}
                    onClick={handleStartClick}
                    disabled={!visibleMap?.unlocked}
                >
                    {visibleMap?.unlocked ? '정화하기' : '잠긴 스테이지'}
                </StartButton>
            </StartButtonContainer>
            {selectedMap && (
                <MapInfoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mapData={{
                        mapTitle: getMapTitle(selectedMap.mapIdx),
                        mapDesc: selectedMap.mapDesc,
                    }}
                    images={[getMapImage(selectedMap.mapIdx)]}
                />
            )}
        </Container>
    );
};

export default MainScreen;
