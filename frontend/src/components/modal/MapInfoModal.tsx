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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 500px;
    max-height: 85vh;
    position: relative;
    animation: ${fadeIn} 0.3s ease-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 200px;
    background: #f5f5f5;
`;

const ImageSlider = styled.div`
    display: flex;
    transition: transform 0.3s ease;
`;

const Image = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    flex-shrink: 0;
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
    padding: 1.5rem;
`;

const Title = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 1rem 0;
    font-weight: bold;
`;

const Summary = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    margin: 0 0 1rem 0;
`;

const DetailBox = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1rem;
    height: 200px;
    overflow-y: auto;
    margin: 1rem 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #555;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
    }
`;

const DetailSection = styled.div`
    margin-bottom: 1rem;

    &:last-child {
        margin-bottom: 0;
    }
`;

const DetailTitle = styled.h3`
    font-size: 0.9rem;
    font-weight: bold;
    color: #444;
    margin: 0 0 0.5rem 0;
`;

const DetailText = styled.p`
    margin: 0;
    color: #666;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 2;

    &:hover {
        background: white;
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

    if (!isOpen) return null;

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
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
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
                <CloseButton onClick={onClose}>×</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default MapInfoModal;
