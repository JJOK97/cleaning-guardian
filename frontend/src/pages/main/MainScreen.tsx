import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaps, getClearedMaps, getMapDetail } from '@/api/maps';
import { getUserInfo } from '@/api/user';
import MapInfoModal from '@/components/modal/MapInfoModal';
import { ProcessedMap, MapResponse } from '@/types/map';
import { getMapImage, getMapTitle } from '@/utils/mapUtils';
import {
    BackgroundWave,
    Container,
    ScrollContainer,
    ContentWrapper,
    MapGrid,
    MapContainer,
    MapContentWrapper,
    MapImage,
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [maps, setMaps] = useState<ProcessedMap[]>([]);
    const [currentMapIndex, setCurrentMapIndex] = useState(0);
    const [visibleMap, setVisibleMap] = useState<ProcessedMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<ProcessedMap | null>(null);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const userInfo = await getUserInfo();
                if (!userInfo.success) {
                    console.error('유저 정보 조회 실패');
                    return;
                }

                const clearedResponse = await getClearedMaps(userInfo.email);
                console.log('클리어한 맵 응답:', clearedResponse);

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

                const reversedMaps = [...mapList].reverse();
                const processedMaps = reversedMaps.map((map) => {
                    const parsedDesc = JSON.parse(map.mapDesc);
                    // 클리어한 맵 목록에 있으면 언락
                    const isUnlocked = clearedMaps.some((clearedMap) => clearedMap.mapIdx === map.mapIdx);

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
                setCurrentMapIndex(0);
                setVisibleMap(processedMaps[0]);

                if (scrollContainerRef.current) {
                    setTimeout(() => {
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                        }
                    }, 100);
                }
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
        const totalHeight = container.scrollHeight;
        const reversedIndex = Math.floor((totalHeight - scrollTop - viewportHeight) / viewportHeight);
        const mapIndex = reversedIndex;

        setCurrentMapIndex(mapIndex);
        setVisibleMap(maps[mapIndex]);
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
                mapTitle: getMapTitle(mapDetail.mapTheme),
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
                            >
                                <MapContentWrapper>
                                    <InfoIcon onClick={(e) => handleInfoClick(e, map)}>!</InfoIcon>
                                    {map.mapTheme === 'city' ? (
                                        <FactoryMapImage
                                            src={getMapImage(map.mapTheme)}
                                            alt={getMapTitle(map.mapTheme)}
                                            $unlocked={map.unlocked}
                                        />
                                    ) : (
                                        <DefaultMapImage
                                            src={getMapImage(map.mapTheme)}
                                            alt={getMapTitle(map.mapTheme)}
                                            $unlocked={map.unlocked}
                                        />
                                    )}
                                    <MapNameWrapper>
                                        <MapName>{getMapTitle(map.mapTheme)}</MapName>
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
                        mapTitle: getMapTitle(selectedMap.mapTheme),
                        mapDesc: selectedMap.mapDesc,
                    }}
                    images={[getMapImage(selectedMap.mapTheme)]}
                />
            )}
        </Container>
    );
};

export default MainScreen;
