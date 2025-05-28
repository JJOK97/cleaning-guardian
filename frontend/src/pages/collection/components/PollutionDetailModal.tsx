import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Pollution } from '@/types/collection';

/**
 * 사용자 수집 통계 정보 (MedalScreen과 동일한 타입)
 */
interface UserCollectionStats {
    statsIdx: number;
    email: string;
    polIdx: number;
    totalDefeated: number;
    totalScore: number;
    maxCombo: number;
    maxScore: number;
    createdAt: string;
    updatedAt: string;
    pollutionName?: string;
    pollutionImage?: string;
    pollutionType?: string;
}

/**
 * 오염물질 상세 정보 모달 컴포넌트 - 도감 스타일
 */

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
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(210, 105, 30, 0.8));
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.25s ease-out forwards;
`;

const ModalContent = styled.div<{ $isClosing: boolean }>`
    background: rgba(255, 248, 220, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    width: 90%;
    max-width: 400px;
    max-height: 75vh; /* 최대 높이 제한 */
    height: auto; /* 자동 높이 */
    min-height: 60vh; /* 최소 높이 보장 */
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.25), 0 4px 16px rgba(160, 82, 45, 0.15);
    border: 3px solid rgba(139, 69, 19, 0.3);
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.25s ease-out forwards;
`;

const ModalGradient = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b4513, #d2691e, #8b4513);
    border-radius: 20px 20px 0 0;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 180px; /* 고정 높이 */
    flex-shrink: 0;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
`;

const ImageFrame = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 16px;
    background: rgba(255, 248, 220, 0.9);
    box-shadow: 0 4px 20px rgba(139, 69, 19, 0.2), inset 0 2px 8px rgba(160, 82, 45, 0.1);
    border: 3px solid rgba(139, 69, 19, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #8b4513, #d2691e, #8b4513);
        border-radius: 18px;
        z-index: -1;
    }
`;

const Image = styled.img`
    width: 70px;
    height: 70px;
    object-fit: contain;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const ContentSection = styled.div`
    padding: 16px;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: rgba(255, 248, 220, 0.95);
    min-height: 0; /* flex 자식이 축소될 수 있도록 */
`;

const Title = styled.h2`
    font-size: 1.2rem;
    color: #8b4513;
    margin: 0 0 12px 0;
    font-weight: 700;
    flex-shrink: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3);
    line-height: 1.3;

    /* 긴 제목 처리 */
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: auto;
`;

const DetailBox = styled.div`
    background: rgba(139, 69, 19, 0.05);
    border-radius: 16px;
    padding: 12px;
    flex: 1;
    overflow-y: auto;
    line-height: 1.4;
    color: #4a5568;
    border: 2px solid rgba(139, 69, 19, 0.1);
    min-height: 0; /* flex 자식이 축소될 수 있도록 */

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(139, 69, 19, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #8b4513, #d2691e);
        border-radius: 4px;

        &:hover {
            background: linear-gradient(180deg, #a0522d, #cd853f);
        }
    }
`;

const DetailSection = styled.div`
    margin-bottom: 12px;
    padding: 12px;
    background: rgba(255, 248, 220, 0.8);
    border-radius: 12px;
    border: 2px solid rgba(139, 69, 19, 0.1);
    position: relative;

    &:last-child {
        margin-bottom: 0;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, #8b4513, #d2691e);
        border-radius: 0 0 0 12px;
    }
`;

const DetailTitle = styled.h3`
    font-size: 0.85rem;
    font-weight: bold;
    color: #8b4513;
    margin: 0 0 8px 0;
    flex-shrink: 0;
`;

const DetailText = styled.p`
    margin: 0;
    color: #4a5568;
    font-size: 0.75rem;
    white-space: pre-line;
    word-break: keep-all;
    overflow-wrap: break-word;
    line-height: 1.5;
    hyphens: auto;

    /* 긴 텍스트 처리 */
    &.long-text {
        max-height: 120px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(139, 69, 19, 0.05);
            border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(139, 69, 19, 0.3);
            border-radius: 2px;
        }
    }
`;

const CloseButton = styled.button`
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #8b4513, #d2691e);
    border: none;
    border-radius: 0 0 20px 20px;
    cursor: pointer;
    font-size: 0.9rem;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
        background: linear-gradient(135deg, #a0522d, #cd853f);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 8px;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 8px;
    border-left: 3px solid #8b4513;

    &:last-child {
        margin-bottom: 0;
    }
`;

const StatLabel = styled.span`
    color: #4a5568;
    font-size: 0.75rem;
    font-weight: 500;
    flex: 1;
    margin-right: 8px;

    /* 긴 라벨 처리 */
    word-break: keep-all;
    overflow-wrap: break-word;
`;

const StatValue = styled.span`
    color: #8b4513;
    font-size: 0.8rem;
    font-weight: bold;
    flex-shrink: 0;
    text-align: right;
`;

const TypeBadge = styled.span<{ $type: string }>`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.65rem;
    font-weight: bold;
    color: white;
    background: ${({ $type }) => {
        switch ($type) {
            case 'W':
                return 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
            case 'L':
                return 'linear-gradient(135deg, #10B981, #047857)';
            case 'A':
                return 'linear-gradient(135deg, #6B7280, #374151)';
            default:
                return 'linear-gradient(135deg, #8B4513, #D2691E)';
        }
    }};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;

    /* 긴 텍스트 처리 */
    word-break: keep-all;
    white-space: nowrap;
`;

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'W':
            return '💧 수질';
        case 'L':
            return '🌱 토양';
        case 'A':
            return '💨 대기';
        default:
            return '🌍 환경';
    }
};

interface PollutionDetailModalProps {
    pollution: Pollution;
    collectionStats?: UserCollectionStats | null;
    onClose: () => void;
}

const PollutionDetailModal: React.FC<PollutionDetailModalProps> = ({ pollution, collectionStats, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250);
    };

    /**
     * 숫자를 천 단위로 포맷
     */
    const formatNumber = (num: number | undefined | null): string => {
        if (num === undefined || num === null || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString();
    };

    /**
     * 텍스트 길이에 따라 클래스 결정
     */
    const getTextClass = (text: string) => {
        return text && text.length > 100 ? 'long-text' : '';
    };

    /**
     * 긴 텍스트 요약 (필요시)
     */
    const truncateText = (text: string, maxLength: number = 200) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
                <ModalGradient />

                {/* 액자 스타일 이미지 섹션 */}
                <ImageContainer>
                    <ImageFrame>
                        <Image
                            src={`/assets/img/pollution/${pollution.polImg1}`}
                            alt={pollution.polName}
                            onError={(e) => {
                                e.currentTarget.src = '/assets/img/pollution/pet.png';
                            }}
                        />
                    </ImageFrame>
                </ImageContainer>

                <ContentSection>
                    {/* 오염물질 기본 정보 */}
                    <Title>
                        {pollution.polName}
                        {pollution.type && <TypeBadge $type={pollution.type}>{getTypeLabel(pollution.type)}</TypeBadge>}
                    </Title>

                    <DetailBox>
                        <DetailSection>
                            <DetailTitle>📝 설명</DetailTitle>
                            <DetailText className={getTextClass(pollution.polDesc)}>{pollution.polDesc}</DetailText>
                        </DetailSection>

                        {/* 환경 영향 인사이트 */}
                        {collectionStats && collectionStats.totalDefeated > 0 && (
                            <DetailSection>
                                <DetailTitle>🌍 환경 영향</DetailTitle>
                                <DetailText>
                                    {pollution.type === 'W' &&
                                        `이 오염물질을 ${collectionStats.totalDefeated}개 처치하여 약 ${Math.round(
                                            collectionStats.totalDefeated * 0.5,
                                        )}L의 깨끗한 물을 되찾았습니다!`}
                                    {pollution.type === 'L' &&
                                        `이 오염물질을 ${collectionStats.totalDefeated}개 처치하여 약 ${Math.round(
                                            collectionStats.totalDefeated * 2,
                                        )}L의 깨끗한 토양을 되찾았습니다!`}
                                    {pollution.type === 'A' &&
                                        `이 오염물질을 ${collectionStats.totalDefeated}개 처치하여 약 ${Math.round(
                                            collectionStats.totalDefeated * 0.8,
                                        )}㎥의 깨끗한 공기를 되찾았습니다!`}
                                </DetailText>
                            </DetailSection>
                        )}

                        {/* 수집 통계 섹션 */}
                        {collectionStats ? (
                            <DetailSection>
                                <DetailTitle>🎮 게임 통계</DetailTitle>
                                <StatItem>
                                    <StatLabel>총 처치 횟수</StatLabel>
                                    <StatValue>{formatNumber(collectionStats.totalDefeated)}회</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>총 획득 점수</StatLabel>
                                    <StatValue>{formatNumber(collectionStats.totalScore)}점</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>최고 콤보</StatLabel>
                                    <StatValue>{collectionStats.maxCombo}콤보</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>최고 점수</StatLabel>
                                    <StatValue>{formatNumber(collectionStats.maxScore)}점</StatValue>
                                </StatItem>
                                {collectionStats.createdAt && (
                                    <StatItem>
                                        <StatLabel>첫 처치일</StatLabel>
                                        <StatValue>
                                            {new Date(collectionStats.createdAt).toLocaleDateString('ko-KR')}
                                        </StatValue>
                                    </StatItem>
                                )}
                            </DetailSection>
                        ) : (
                            <DetailSection>
                                <DetailTitle>🎮 게임 통계</DetailTitle>
                                <DetailText style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                                    아직 이 오염물질을 처치하지 않았습니다.
                                    <br />
                                    게임을 플레이하여 처치해보세요!
                                </DetailText>
                            </DetailSection>
                        )}
                    </DetailBox>
                </ContentSection>
                <CloseButton onClick={handleClose}>닫기</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PollutionDetailModal;
