import React from 'react';
import styled from 'styled-components';
import { ProcessedStageInfo } from '@/types/map';
import { PollutionData } from '@/api/stages';
import { UserSkinData } from '@/api/skins';

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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: linear-gradient(135deg, rgba(40, 60, 40, 0.95) 0%, rgba(80, 120, 80, 0.9) 100%);
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 2px solid rgba(120, 255, 120, 0.2);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const Title = styled.h2`
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Section = styled.div`
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
`;

const SectionTitle = styled.h3`
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const PollutionList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
`;

const PollutionItem = styled.div`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 0.8rem;
    text-align: center;
`;

const PollutionImage = styled.img`
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 0.5rem;
`;

const PollutionName = styled.p`
    color: #fff;
    font-size: 0.9rem;
    margin: 0;
`;

const SkinSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const SkinItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 0.8rem;
`;

const SkinInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const SkinImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
`;

const SkinName = styled.span`
    color: #fff;
    font-size: 1rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${(props) => (props.$primary ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)')};
    color: #fff;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Title>{stageInfo.stageName}</Title>

                <Section>
                    <SectionTitle>미션 정보</SectionTitle>
                    <p style={{ color: '#fff', margin: 0 }}>{stageInfo.stageMission.mission}</p>
                </Section>

                <Section>
                    <SectionTitle>오염물 정보</SectionTitle>
                    <PollutionList>
                        {pollutions.map((pollution) => (
                            <PollutionItem key={pollution.polIdx}>
                                <PollutionImage
                                    src={pollution.polImg1}
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
                        {equippedSkins.slice && equippedSkins.slice.skinType === 'S' && (
                            <SkinItem>
                                <SkinInfo>
                                    <SkinImage
                                        src={equippedSkins.slice.skinImg || '/default-slice.png'}
                                        alt='슬라이스 스킨'
                                    />
                                    <SkinName>{equippedSkins.slice.skinName || '기본 슬라이스 스킨'}</SkinName>
                                </SkinInfo>
                                <Button onClick={onChangeSkin}>변경</Button>
                            </SkinItem>
                        )}
                        {stageInfo.isFinalStage === 'Y' && equippedSkins.tap && equippedSkins.tap.skinType === 'T' && (
                            <SkinItem>
                                <SkinInfo>
                                    <SkinImage
                                        src={equippedSkins.tap.skinImg || '/default-tap.png'}
                                        alt='탭 스킨'
                                    />
                                    <SkinName>{equippedSkins.tap.skinName || '기본 탭 스킨'}</SkinName>
                                </SkinInfo>
                                <Button onClick={onChangeSkin}>변경</Button>
                            </SkinItem>
                        )}
                    </SkinSection>
                </Section>

                <ButtonGroup>
                    <Button onClick={onClose}>닫기</Button>
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
