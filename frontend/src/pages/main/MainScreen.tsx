import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getClearedMaps, getMapDetail, getMaps } from '@/api/maps';
import { useAuth } from '@/hooks/useAuth';
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
import LoadingScreen from '@/components/common/LoadingScreen';

const MainScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [maps, setMaps] = useState<ProcessedMap[]>([]);
    const [visibleMap, setVisibleMap] = useState<ProcessedMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<ProcessedMap | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                setIsLoading(true);
                const [allMapsResponse, clearedMapsResponse] = await Promise.all([
                    getMaps(),
                    user?.email ? getClearedMaps(user.email) : Promise.resolve({ maplist: [] }),
                ]);

                if (!allMapsResponse.success || !allMapsResponse.maplist) {
                    console.error('맵 데이터가 없습니다');
                    return;
                }

                const mapList = allMapsResponse.maplist;
                const clearedMaps = clearedMapsResponse.maplist || [];

                const processedMaps = mapList.map((map) => {
                    const parsedDesc = JSON.parse(map.mapDesc);
                    const isUnlocked =
                        map.mapIdx === 1 || clearedMaps.some((clearedMap) => clearedMap.mapIdx === map.mapIdx);

                    return {
                        mapIdx: map.mapIdx,
                        gameIdx: map.gameIdx,
                        mapTitle: map.mapTitle,
                        mapTheme: map.mapTheme,
                        createdAt: map.createdAt,
                        map_desc: map.mapDesc,
                        mapDesc: parsedDesc,
                        unlocked: isUnlocked,
                    } as ProcessedMap;
                });

                setMaps(processedMaps);

                // location state에서 selectedMap이 있으면 해당 맵 선택
                const state = location.state as { selectedMap?: number } | null;
                if (state?.selectedMap) {
                    const nextMap = processedMaps.find((map) => map.mapIdx === state.selectedMap);
                    if (nextMap) {
                        setSelectedMap(nextMap);
                        setVisibleMap(nextMap);
                        // 스크롤 위치 조정
                        if (scrollContainerRef.current) {
                            const mapIndex = processedMaps.findIndex((map) => map.mapIdx === nextMap.mapIdx);
                            scrollContainerRef.current.scrollTo({
                                top: mapIndex * window.innerHeight,
                                behavior: 'smooth',
                            });
                        }
                    }
                } else {
                    // 가장 높은 맵 찾기
                    const highestUnlockedMap = processedMaps.reduce((highest, current) => {
                        if (current.unlocked && current.mapIdx > highest.mapIdx) {
                            return current;
                        }
                        return highest;
                    }, processedMaps[0]);

                    setVisibleMap(highestUnlockedMap);
                    setSelectedMap(highestUnlockedMap);

                    // 스크롤 위치 조정
                    if (scrollContainerRef.current) {
                        const mapIndex = processedMaps.findIndex((map) => map.mapIdx === highestUnlockedMap.mapIdx);
                        scrollContainerRef.current.scrollTo({
                            top: mapIndex * window.innerHeight,
                            behavior: 'smooth',
                        });
                    }
                }
            } catch (error) {
                console.error('맵 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaps();
    }, [location.state, navigate, user?.email]);

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
            navigate(`/stage-select/${visibleMap.mapIdx}`);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

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
