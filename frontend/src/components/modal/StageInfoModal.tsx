import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ProcessedStageInfo } from '@/types/map';
import { PollutionData } from '@/api/stages';
import { UserSkinData } from '@/api/skins';
import { pollutionNameToFile, skinNameToFile } from '@/utils/assetMapping';

interface StageInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    stageInfo: ProcessedStageInfo;
    pollutions: PollutionData[];
    equippedSkins: {
        slice: UserSkinData | null;
        tap: UserSkinData | null;
    };
    onChangeSkin: () => void;
    onStartGame: () => void;
}

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
    background: linear-gradient(135deg, rgba(40, 60, 40, 0.95) 0%, rgba(80, 120, 80, 0.9) 100%);
    border-radius: 24px;
    width: clamp(320px, 95vw, 70vw);
    height: clamp(480px, 85vh, 90vh);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.25s ease-out forwards;
    border: 2px solid rgba(120, 255, 120, 0.2);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;

    &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.3);
    }
`;

const ContentSection = styled.div`
    padding: clamp(0.8rem, 2vw, 1.2rem) clamp(0.6rem, 1.5vw, 0.8rem);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: clamp(0.8rem, 2vw, 1rem);

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(120, 255, 120, 0.3);
        border-radius: 4px;

        &:hover {
            background: rgba(120, 255, 120, 0.4);
        }
    }
`;

const Title = styled.h2`
    font-size: clamp(1.2rem, 3vw, 1.4rem);
    color: #fff;
    margin: 0 0 0.6rem 0;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Section = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: clamp(0.8rem, 2vw, 1rem);
    border: 1px solid rgba(120, 255, 120, 0.2);
`;

const SectionTitle = styled.h3`
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    color: #8bc34a;
    margin: 0 0 0.8rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const PollutionList = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
`;

const PollutionItem = styled.div`
    border-radius: 12px;
    padding: clamp(0.6rem, 1.5vw, 0.8rem);
    text-align: center;
`;

const PollutionImage = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background: #222;
    border-radius: 8px;
    margin-bottom: 0.5rem;
`;

const PollutionName = styled.p`
    color: #fff;
    font-size: clamp(0.7rem, 2vw, 0.8rem);
    margin: 0;
`;

const SkinSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
`;

const SkinItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: clamp(0.6rem, 1.5vw, 0.8rem);
    border: 1px solid rgba(120, 255, 120, 0.1);
`;

const SkinInfo = styled.div`
    display: flex;
    align-items: center;
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
`;

const SkinImage = styled.img`
    width: clamp(32px, 8vw, 40px);
    height: clamp(32px, 8vw, 40px);
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background: #222;
    border-radius: 8px;
`;

const SkinName = styled.span`
    color: #fff;
    font-size: clamp(0.8rem, 2.2vw, 0.9rem);
`;

const ButtonGroup = styled.div`
    padding: clamp(0.8rem, 2vw, 1rem);
    display: flex;
    gap: clamp(0.6rem, 1.5vw, 0.8rem);
    background: rgba(0, 0, 0, 0.2);
`;

const Button = styled.button<{ $primary?: boolean }>`
    flex: 1;
    padding: clamp(0.6rem, 1.5vw, 0.8rem);
    border: none;
    border-radius: 12px;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${(props) => (props.$primary ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)')};
    color: #fff;

    &:active {
        transform: scale(0.98);
    }
`;

const StageInfoModal: React.FC<StageInfoModalProps> = ({
    isOpen,
    onClose,
    stageInfo,
    pollutions,
    equippedSkins,
    onChangeSkin,
    onStartGame,
}) => {
    const [isClosing, setIsClosing] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250);
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
                <CloseButton onClick={handleClose}>×</CloseButton>
                <ContentSection>
                    <Title>{stageInfo.stageName}</Title>

                    <Section>
                        <SectionTitle>미션 정보</SectionTitle>
                        <p style={{ color: '#fff', margin: 0, fontSize: '0.9rem' }}>{stageInfo.stageMission.mission}</p>
                    </Section>

                    <Section>
                        <SectionTitle>오염물 정보</SectionTitle>
                        <PollutionList>
                            {pollutions.map((pollution) => (
                                <PollutionItem key={pollution.polIdx}>
                                    <PollutionImage
                                        src={pollutionNameToFile[pollution.polName]}
                                        alt={pollution.polName}
                                    />
                                    <PollutionName>{pollution.polName}</PollutionName>
                                </PollutionItem>
                            ))}
                        </PollutionList>
                    </Section>

                    <Section>
                        <SectionTitle>장착된 스킨</SectionTitle>
                        <SkinSection>
                            {equippedSkins.slice &&
                                equippedSkins.slice.skinType === 'S' &&
                                equippedSkins.slice.skin && (
                                    <SkinItem>
                                        <SkinInfo>
                                            <SkinImage
                                                src={skinNameToFile[equippedSkins.slice.skin.skinName]}
                                                alt={equippedSkins.slice.skin.skinName || '슬라이스 스킨'}
                                            />
                                            <SkinName>
                                                {equippedSkins.slice.skin.skinName || '기본 슬라이스 스킨'}
                                            </SkinName>
                                        </SkinInfo>
                                        <Button onClick={onChangeSkin}>변경</Button>
                                    </SkinItem>
                                )}
                            {stageInfo.isFinalStage === 'Y' &&
                                equippedSkins.tap &&
                                equippedSkins.tap.skinType === 'T' &&
                                equippedSkins.tap.skin && (
                                    <SkinItem>
                                        <SkinInfo>
                                            <SkinImage
                                                src={skinNameToFile[equippedSkins.tap.skin.skinName]}
                                                alt={equippedSkins.tap.skin.skinName || '탭 스킨'}
                                            />
                                            <SkinName>{equippedSkins.tap.skin.skinName || '기본 탭 스킨'}</SkinName>
                                        </SkinInfo>
                                        <Button onClick={onChangeSkin}>변경</Button>
                                    </SkinItem>
                                )}
                        </SkinSection>
                    </Section>
                </ContentSection>

                <ButtonGroup>
                    <Button onClick={handleClose}>닫기</Button>
                    <Button
                        $primary
                        onClick={onStartGame}
                    >
                        게임 시작
                    </Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default StageInfoModal;
