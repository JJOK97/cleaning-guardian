import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { maps } from '@/data/maps';
import waveBg from '@/assets/img/background/wave.png';
import trashIslandImg from '@/assets/img/map/trash_island.png';

const waveAnimation = keyframes`
    0% {
        transform: translateX(-50%) translateY(0);
    }
    50% {
        transform: translateX(-30%) translateY(-10px);
    }
    100% {
        transform: translateX(-50%) translateY(0);
    }
`;

const BackgroundWave = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background-image: url(${waveBg});
    background-repeat: repeat-x;
    background-size: auto 100%;
    background-position: center;
    animation: ${waveAnimation} 10s ease-in-out infinite;
    z-index: 0;
`;

const Container = styled.div`
    position: relative;
    height: 100vh;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.background.main} 0%,
        ${({ theme }) => theme.colors.background.light} 100%
    );
    overflow: hidden;
    perspective: 1000px;
`;

const ScrollContainer = styled.div`
    height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    height: 300vh; // 3개의 맵을 위한 전체 높이
`;

const MapGrid = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const scaleIn = keyframes`
    from {
        transform: scale(0.95);
        opacity: 0.5;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
`;

const shakeAnimation = keyframes`
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-10deg);
    }
    75% {
        transform: rotate(10deg);
    }
`;

const MapContainer = styled.div<{ $index: number }>`
    position: absolute;
    top: ${({ $index }) => $index * 100}vh;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    padding: 2rem;
`;

const MapContentWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10vh;
`;

const MapImage = styled.img<{ $unlocked: boolean }>`
    width: auto;
    height: clamp(25vh, 35vh, 45vh);
    object-fit: contain;
    filter: ${({ $unlocked }) =>
        $unlocked ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' : 'grayscale(1) brightness(0.7)'};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${scaleIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
        height: clamp(30vh, 40vh, 50vh);
    }

    @media (min-width: 1024px) {
        height: clamp(35vh, 45vh, 55vh);
    }
`;

const MapNameWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 1rem;

    @media (min-width: 768px) {
        padding: 0 2rem;
    }

    @media (min-width: 1024px) {
        padding: 0 3rem;
    }
`;

const MapName = styled.h2`
    font-size: clamp(2rem, 5vw, 4rem);
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    margin: 0;
    text-align: center;
    line-height: 1.2;
    letter-spacing: -0.02em;

    @media (min-width: 768px) {
        letter-spacing: -0.03em;
    }

    @media (min-width: 1024px) {
        letter-spacing: -0.04em;
    }
`;

const InfoIcon = styled.button`
    width: clamp(32px, 5vw, 48px);
    height: clamp(32px, 5vw, 48px);
    border-radius: 50%;
    border: 2px solid white;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    position: absolute;
    top: 0;
    right: 2rem;
    z-index: 2;
    animation: ${shakeAnimation} 3s ease-in-out infinite;
    backdrop-filter: blur(4px);

    @media (min-width: 768px) {
        width: clamp(40px, 6vw, 56px);
        height: clamp(40px, 6vw, 56px);
        font-size: clamp(1.3rem, 3vw, 1.8rem);
        right: 1.5rem;
    }

    @media (min-width: 1024px) {
        width: clamp(48px, 7vw, 64px);
        height: clamp(48px, 7vw, 64px);
        font-size: clamp(1.5rem, 3.5vw, 2rem);
        right: 2rem;
        border-width: 3px;
    }

    &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
        animation: none;
    }

    &:active {
        transform: scale(0.95);
    }
`;

const StartButtonContainer = styled.div`
    position: fixed;
    bottom: calc(7.2rem + 1rem); // Footer 높이(4.2rem) + 여백(1rem)
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: 90%;
    max-width: 300px;
    display: flex;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom); // iOS 안전영역 고려
`;

const buttonAnimation = keyframes`
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
    100% {
        transform: translateY(0);
    }
`;

const lockAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

const StartButton = styled.button<{ $unlocked: boolean }>`
    width: 100%;
    padding: 1.2rem;
    font-size: 1.4rem;
    font-weight: bold;
    border-radius: 30px;
    border: none;
    background: ${({ $unlocked }) =>
        $unlocked
            ? `linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(129, 199, 132, 0.9))`
            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))'};
    color: ${({ $unlocked }) => ($unlocked ? 'white' : 'rgba(255, 255, 255, 0.6)')};
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $unlocked }) => ($unlocked ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none')};
    backdrop-filter: blur(5px);
    text-shadow: ${({ $unlocked }) => ($unlocked ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none')};
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    ${({ $unlocked }) =>
        $unlocked &&
        css`
            &:hover {
                transform: scale(1.02);
                box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
                animation: ${buttonAnimation} 2s ease-in-out infinite;
            }
        `}

    &:active {
        transform: ${({ $unlocked }) => ($unlocked ? 'scale(0.98)' : 'none')};
    }

    &::before {
        content: '🔒';
        font-size: 1.2rem;
        opacity: ${({ $unlocked }) => ($unlocked ? 0 : 0.6)};
        transform: ${({ $unlocked }) => ($unlocked ? 'scale(0)' : 'scale(1)')};
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: ${({ $unlocked }) => ($unlocked ? 'absolute' : 'relative')};
        visibility: ${({ $unlocked }) => ($unlocked ? 'hidden' : 'visible')};
        animation: ${({ $unlocked }) =>
            !$unlocked &&
            css`
                ${lockAnimation} 2s ease-in-out infinite
            `};
    }
`;

const MainScreen: React.FC = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentMapIndex, setCurrentMapIndex] = useState(0);
    const [visibleMap, setVisibleMap] = useState(maps[0]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const viewportHeight = container.clientHeight;
            const mapIndex = Math.floor(scrollTop / viewportHeight);
            setCurrentMapIndex(mapIndex);
            setVisibleMap(maps[mapIndex]);
        };

        container.addEventListener('scroll', handleScroll);

        // 초기 위치 설정 - 1번 맵이 보이도록
        container.scrollTop = 0;
        handleScroll();

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleInfoClick = (e: React.MouseEvent, map: (typeof maps)[0]) => {
        e.stopPropagation();
        // TODO: 모달 표시 로직 추가
        console.log('Show info for:', map.name);
    };

    const handleStartClick = () => {
        if (visibleMap && visibleMap.unlocked) {
            navigate(`/stage-select/${visibleMap.id}`);
        }
    };

    return (
        <Container>
            <BackgroundWave />
            <ScrollContainer ref={scrollContainerRef}>
                <ContentWrapper>
                    <MapGrid>
                        {maps.map((map, index) => (
                            <MapContainer
                                key={map.id}
                                $index={index}
                            >
                                <MapContentWrapper>
                                    <InfoIcon onClick={(e) => handleInfoClick(e, map)}>!</InfoIcon>
                                    {map.id === 'ocean' ? (
                                        <MapImage
                                            src={trashIslandImg}
                                            alt='쓰레기 섬'
                                            $unlocked={map.unlocked}
                                        />
                                    ) : (
                                        <MapImage
                                            src={trashIslandImg}
                                            alt={map.name}
                                            $unlocked={map.unlocked}
                                        />
                                    )}
                                    <MapNameWrapper>
                                        <MapName>{map.name}</MapName>
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
        </Container>
    );
};

export default MainScreen;
