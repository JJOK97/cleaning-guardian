import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getClearedMaps, getMapDetail, getMaps } from '@/api/maps';
import { useAuth } from '@/hooks/useAuth';
import MapInfoModal from '@/components/modal/MapInfoModal';
import { ProcessedMap } from '@/types/map';
import { getMapImage, getMapTitle } from '@/utils/mapUtils';
import upArrowImg from '@/assets/img/common/up.png';
import downArrowImg from '@/assets/img/common/down.png';
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
    const { user, loading: authLoading } = useAuth();
    const [maps, setMaps] = useState<ProcessedMap[]>([]);
    const [visibleMap, setVisibleMap] = useState<ProcessedMap | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState<ProcessedMap | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                setIsLoading(true);
                console.log('맵 데이터 로딩 시작, 사용자:', user?.email);

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
                console.log('클리어한 맵 목록:', clearedMaps);

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
                console.log(
                    '처리된 맵 목록:',
                    processedMaps.map((m) => ({ idx: m.mapIdx, unlocked: m.unlocked })),
                );

                // 이미지 프리로딩
                const imagePromises = processedMaps.map((map) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = getMapImage(map.mapIdx);
                    });
                });

                await Promise.all(imagePromises);
                setImagesLoaded(true);

                // 맵 위치 결정 로직 개선
                const state = location.state as { selectedMap?: number } | null;
                let targetMap: ProcessedMap;

                if (state?.selectedMap) {
                    // location state에서 지정된 맵이 있으면 해당 맵 선택
                    const nextMap = processedMaps.find((map) => map.mapIdx === state.selectedMap);
                    targetMap = nextMap || processedMaps[0];
                    console.log('location state에서 맵 선택:', targetMap.mapIdx);
                } else {
                    // Footer에서 지도 버튼을 눌렀거나 직접 접근한 경우
                    // 사용자가 플레이할 수 있는 가장 높은 맵 찾기
                    const unlockedMaps = processedMaps.filter((map) => map.unlocked);
                    if (unlockedMaps.length > 0) {
                        // 언락된 맵 중 가장 높은 인덱스
                        targetMap = unlockedMaps.reduce((highest, current) => {
                            return current.mapIdx > highest.mapIdx ? current : highest;
                        });
                        console.log('사용자가 플레이할 수 있는 가장 높은 맵으로 이동:', targetMap.mapIdx);
                    } else {
                        // 언락된 맵이 없으면 첫 번째 맵
                        targetMap = processedMaps[0];
                        console.log('언락된 맵이 없어 첫 번째 맵으로 이동:', targetMap.mapIdx);
                    }
                }

                setVisibleMap(targetMap);
                setSelectedMap(targetMap);

                // 스크롤 대신 visibleMap 상태로 직접 맵 변경
                console.log('타겟 맵 설정 완료:', targetMap.mapIdx);

                // 스크롤 컨테이너를 해당 맵 위치로 즉시 이동
                if (scrollContainerRef.current) {
                    const mapIndex = targetMap.mapIdx - 1;
                    const scrollTop = mapIndex * window.innerHeight;
                    console.log('스크롤 위치 강제 설정:', scrollTop, 'px');

                    // 스크롤 스냅 일시적으로 비활성화
                    scrollContainerRef.current.style.scrollSnapType = 'none';
                    scrollContainerRef.current.style.scrollBehavior = 'auto';

                    // 즉시 스크롤
                    scrollContainerRef.current.scrollTop = scrollTop;

                    // 잠시 후 스크롤 스냅 다시 활성화
                    setTimeout(() => {
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.style.scrollSnapType = 'y mandatory';
                            scrollContainerRef.current.style.scrollBehavior = 'smooth';
                        }
                    }, 500);
                }
            } catch (error) {
                console.error('맵 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // 사용자 인증 로딩이 완료된 후에만 맵 데이터 로딩
        if (!authLoading) {
            fetchMaps();
        }
    }, [location.state?.selectedMap, user?.email, authLoading]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const mapIndex = Math.round(scrollTop / viewportHeight);

        console.log('스크롤 이벤트:', { scrollTop, viewportHeight, mapIndex });

        if (maps[mapIndex] && visibleMap !== maps[mapIndex]) {
            console.log('visibleMap 변경:', maps[mapIndex].mapIdx);
            setVisibleMap(maps[mapIndex]);
        }
    };

    // 특정 맵으로 스크롤하는 함수
    const scrollToMap = (mapIdx: number) => {
        if (!scrollContainerRef.current) return;

        const mapIndex = mapIdx - 1;
        const scrollTop = mapIndex * window.innerHeight;

        console.log('맵으로 스크롤:', mapIdx, '위치:', scrollTop);

        // 스크롤 스냅 일시적으로 비활성화
        scrollContainerRef.current.style.scrollSnapType = 'none';

        scrollContainerRef.current.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
        });

        // 스크롤 완료 후 스냅 다시 활성화
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.scrollSnapType = 'y mandatory';
            }
        }, 1000);
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

    if (authLoading || isLoading || !imagesLoaded) {
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
                                onClick={() => {
                                    setVisibleMap(map);
                                    scrollToMap(map.mapIdx);
                                }}
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
            {/* 첫 번째 맵으로 이동 버튼 (위쪽) */}
            <button
                onClick={() => {
                    console.log('첫 번째 맵으로 이동');
                    scrollToMap(1);
                }}
                style={{
                    position: 'absolute',
                    top: '15%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    padding: '0',
                    background: 'transparent',
                    border: 'none',
                    zIndex: 1000,
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={upArrowImg}
                    alt='위로 이동'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </button>

            {/* 최고 맵으로 이동 버튼 (아래쪽) */}
            <button
                onClick={() => {
                    // 사용자가 클리어한 가장 높은 맵 찾기
                    const unlockedMaps = maps.filter((map) => map.unlocked);
                    if (unlockedMaps.length > 0) {
                        const highestMap = unlockedMaps.reduce((highest, current) => {
                            return current.mapIdx > highest.mapIdx ? current : highest;
                        });
                        console.log('최고 맵으로 이동:', highestMap.mapIdx);
                        scrollToMap(highestMap.mapIdx);
                    }
                }}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '20px',
                    padding: '0',
                    background: 'transparent',
                    border: 'none',
                    zIndex: 1000,
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={downArrowImg}
                    alt='아래로 이동'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </button>
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
