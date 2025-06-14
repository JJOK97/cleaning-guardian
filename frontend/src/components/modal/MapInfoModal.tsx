import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MapModalData } from '@/api/maps';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const fadeOut = keyframes`
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
`;

const ModalOverlay = styled.div<{ $isClosing: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.25s ease-out forwards;
`;

const ModalContent = styled.div<{ $isClosing: boolean }>`
    background: #fff9e6;
    border-radius: 24px;
    width: 90%;
    max-width: 400px;
    height: 60vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.25s ease-out forwards;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 20vh;
    background: #7fdbff;
    flex-shrink: 0;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #48b4e0 25%, #7fdbff 50%, #48b4e0 75%);
        opacity: 0.5;
    }
`;

const ImageSlider = styled.div`
    display: flex;
    transition: transform 0.3s ease;
`;

const Image = styled.img`
    width: 100%;
    height: 20vh;
    object-fit: cover;
    flex-shrink: 0;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const SlideButton = styled.button<{ $direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${({ $direction }) => $direction}: 1rem;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 2;

    &:hover {
        background: white;
    }
`;

const ImageIndicators = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 2;
`;

const Indicator = styled.div<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? 'white' : 'rgba(255, 255, 255, 0.5)')};
    cursor: pointer;
    transition: all 0.2s ease;
`;

const ContentSection = styled.div`
    padding: 1.2rem 0.8rem;
    flex-shrink: 0;
    overflow: hidden;
    height: calc(40vh - 3rem);
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #fff9e6 0%, rgba(255, 249, 230, 0.95) 100%);
`;

const Title = styled.h2`
    font-size: 1.4rem;
    color: #2d3748;
    margin: 0 0 0.6rem 0;
    font-weight: bold;
    flex-shrink: 0;
    text-align: center;
`;

const Summary = styled.p`
    font-size: 0.75rem;
    color: #4a5568;
    line-height: 1.4;
    margin: 0 0 0.8rem 0;
    flex-shrink: 0;
    text-align: center;
    padding: 0 0.8rem;
    white-space: pre-line;
    word-break: keep-all;
    overflow-wrap: break-word;
`;

const DetailBox = styled.div`
    background: rgba(127, 219, 255, 0.1);
    border-radius: 16px;
    padding: 1rem 0.6rem;
    flex: 1;
    overflow-y: auto;
    line-height: 1.4;
    color: #4a5568;
    margin: 0 -0.4rem;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(127, 219, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #8bc34a;
        border-radius: 4px;

        &:hover {
            background: #7cb342;
        }
    }
`;

const DetailSection = styled.div`
    margin-bottom: 1rem;
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(127, 219, 255, 0.2);
    margin: 0 0.4rem 0.8rem 0.4rem;

    &:last-child {
        margin-bottom: 0.4rem;
    }
`;

const DetailTitle = styled.h3`
    font-size: 0.9rem;
    font-weight: bold;
    color: #8bc34a;
    margin: 0 0 0.4rem 0;
`;

const DetailText = styled.p`
    margin: 0;
    color: #4a5568;
    font-size: 0.75rem;
    white-space: pre-line;
    word-break: keep-all;
    overflow-wrap: break-word;
`;

const CloseButton = styled.button`
    width: 100%;
    padding: 0.8rem;
    background: #8bc34a;
    border: none;
    border-radius: 0 0 24px 24px;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    transition: all 0.2s ease;
    flex-shrink: 0;
    height: 3rem;

    &:hover {
        background: #7cb342;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;

interface MapInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    mapData: MapModalData;
    images: string[];
}

const MapInfoModal: React.FC<MapInfoModalProps> = ({ isOpen, onClose, mapData, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <ModalOverlay
            onClick={handleClose}
            $isClosing={isClosing}
        >
            <ModalContent
                onClick={(e) => e.stopPropagation()}
                $isClosing={isClosing}
            >
                <ImageContainer>
                    <ImageSlider style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                        {images.map((src, index) => (
                            <Image
                                key={index}
                                src={src}
                                alt={`환경오염 이미지 ${index + 1}`}
                            />
                        ))}
                    </ImageSlider>
                    <SlideButton
                        $direction='left'
                        onClick={prevImage}
                    >
                        ←
                    </SlideButton>
                    <SlideButton
                        $direction='right'
                        onClick={nextImage}
                    >
                        →
                    </SlideButton>
                    <ImageIndicators>
                        {images.map((_, index) => (
                            <Indicator
                                key={index}
                                $active={currentImageIndex === index}
                                onClick={() => goToImage(index)}
                            />
                        ))}
                    </ImageIndicators>
                </ImageContainer>

                <ContentSection>
                    <Title>{mapData.mapTitle}</Title>
                    <Summary>{mapData.mapDesc.summary}</Summary>
                    <DetailBox>
                        <DetailSection>
                            <DetailTitle>현재 상태</DetailTitle>
                            <DetailText>{mapData.mapDesc.current_status}</DetailText>
                        </DetailSection>
                        <DetailSection>
                            <DetailTitle>원인</DetailTitle>
                            <DetailText>{mapData.mapDesc.cause}</DetailText>
                        </DetailSection>
                        <DetailSection>
                            <DetailTitle>건강 영향</DetailTitle>
                            <DetailText>{mapData.mapDesc.health_impact}</DetailText>
                        </DetailSection>
                        <DetailSection>
                            <DetailTitle>개선 효과</DetailTitle>
                            <DetailText>{mapData.mapDesc.improvement}</DetailText>
                        </DetailSection>
                    </DetailBox>
                </ContentSection>
                <CloseButton onClick={handleClose}>닫기</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default MapInfoModal;
