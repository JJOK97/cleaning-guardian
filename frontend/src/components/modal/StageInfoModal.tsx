import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ProcessedStageInfo } from '@/types/map';
import { PollutionData } from '@/api/stages';
import { UserSkinData } from '@/api/skins';
import { GameItem, getUserItems, useItem, getEquippedItems } from '@/api/game';
import { UserItem } from '@/types/inventory';
import { pollutionNameToFile } from '@/utils/assetMapping';
import { useAuth } from '@/hooks/useAuth';

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
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const ModalContent = styled.div<{ $isClosing: boolean }>`
    background: linear-gradient(135deg, rgba(30, 45, 30, 0.95) 0%, rgba(60, 90, 60, 0.9) 100%);
    border-radius: 28px;
    width: clamp(320px, 95vw, 70vw);
    height: clamp(480px, 85vh, 90vh);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(120, 255, 120, 0.1), 0 0 32px rgba(120, 255, 120, 0.1);
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;
    backdrop-filter: blur(4px);

    &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.25);
    }
`;

const ContentSection = styled.div`
    padding: clamp(1rem, 2.5vw, 1.5rem) clamp(0.8rem, 2vw, 1rem);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: clamp(1rem, 2.5vw, 1.2rem);

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(120, 255, 120, 0.2);
        border-radius: 4px;

        &:hover {
            background: rgba(120, 255, 120, 0.3);
        }
    }
`;

const Title = styled.h2`
    font-size: clamp(1.4rem, 3.5vw, 1.6rem);
    color: #fff;
    margin: 0 0 1rem 0;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
`;

const Section = styled.div`
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: clamp(1rem, 2.5vw, 1.2rem);
    border: 1px solid rgba(120, 255, 120, 0.15);
    backdrop-filter: blur(4px);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

const SectionTitle = styled.h3`
    font-size: clamp(1rem, 2.8vw, 1.1rem);
    color: #8bc34a;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.5px;
`;

const PollutionList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: clamp(0.8rem, 2vw, 1rem);
`;

const PollutionItem = styled.div`
    border-radius: 16px;
    padding: clamp(0.8rem, 2vw, 1rem);
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

const PollutionImage = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    margin-bottom: 0.8rem;
    padding: 0.5rem;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const PollutionName = styled.p`
    color: #fff;
    font-size: clamp(0.8rem, 2.2vw, 0.9rem);
    margin: 0;
    font-weight: 500;
`;

const SkinSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(0.8rem, 2vw, 1rem);
`;

const SkinItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: clamp(0.8rem, 2vw, 1rem);
    border: 1px solid rgba(120, 255, 120, 0.15);
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.15);
    }
`;

const SkinInfo = styled.div`
    display: flex;
    align-items: center;
    gap: clamp(0.8rem, 2vw, 1rem);
`;

const SkinImage = styled.img`
    width: clamp(40px, 10vw, 48px);
    height: clamp(40px, 10vw, 48px);
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 0.4rem;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const SkinName = styled.span`
    color: #fff;
    font-size: clamp(0.9rem, 2.4vw, 1rem);
    font-weight: 500;
`;

const ButtonGroup = styled.div`
    padding: clamp(1rem, 2.5vw, 1.2rem);
    display: flex;
    gap: clamp(0.8rem, 2vw, 1rem);
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
`;

const Button = styled.button<{ $primary?: boolean }>`
    flex: 1;
    padding: clamp(0.8rem, 2vw, 1rem);
    border: none;
    border-radius: 16px;
    font-size: clamp(1rem, 2.8vw, 1.1rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${(props) =>
        props.$primary ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'rgba(255, 255, 255, 0.15)'};
    color: #fff;
    letter-spacing: 0.5px;

    &:hover {
        transform: translateY(-2px);
        background: ${(props) =>
            props.$primary ? 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' : 'rgba(255, 255, 255, 0.2)'};
    }

    &:active {
        transform: scale(0.98);
    }
`;

const ItemSection = styled(Section)`
    margin-top: 1rem;
`;

const ItemList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
`;

const ItemCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.15);
    }
`;

const ItemImage = styled.img`
    width: 48px;
    height: 48px;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 0.4rem;
`;

const ItemName = styled.span`
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
`;

const ItemDesc = styled.p`
    color: #ccc;
    font-size: 0.8rem;
    text-align: center;
    margin: 0;
`;

const ItemCount = styled.span`
    color: #4caf50;
    font-size: 0.9rem;
    font-weight: 600;
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
    const [userItems, setUserItems] = useState<UserItem[]>([]);
    const [equippedItems, setEquippedItems] = useState<UserItem[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserItems = async () => {
            if (!user?.email) return;
            try {
                const response = await getUserItems(user.email);
                if (response && response.success && response.uitemlist) {
                    setUserItems(response.uitemlist);
                }
            } catch (error) {
                console.error('아이템 조회 에러:', error);
            }
        };

        const fetchEquippedItems = async () => {
            if (!user?.email) return;
            try {
                const response = await getEquippedItems(user.email);
                if (response && response.success && response.items) {
                    setEquippedItems(response.items);
                }
            } catch (error) {
                console.error('장착된 아이템 조회 에러:', error);
            }
        };

        if (isOpen) {
            fetchUserItems();
            fetchEquippedItems();
        }
    }, [isOpen, user?.email]);

    const handleItemUse = async (itemIdx: number) => {
        if (!user?.email) return;
        try {
            const response = await useItem(user.email, itemIdx);
            if (response && response.success) {
                const updatedItems = await getUserItems(user.email);
                if (updatedItems && updatedItems.success && updatedItems.uitemlist) {
                    setUserItems(updatedItems.uitemlist);
                }
            }
        } catch (error) {
            console.error('아이템 사용 에러:', error);
        }
    };

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
                                        src={`/assets/img/pollution/${pollution.polImg1}`}
                                        alt={pollution.polName}
                                        onError={(e) => {
                                            e.currentTarget.src = '/assets/img/pollution/pet.png';
                                        }}
                                    />
                                    <PollutionName>{pollution.polName}</PollutionName>
                                </PollutionItem>
                            ))}
                        </PollutionList>
                    </Section>

                    <ItemSection>
                        <SectionTitle>장착된 아이템</SectionTitle>
                        <ItemList>
                            {equippedItems.map((equippedItem) => (
                                <ItemCard key={equippedItem.userItemIdx}>
                                    <ItemImage
                                        src={`/assets/img/items/${equippedItem.item.itemImg}.png`}
                                        alt={equippedItem.item.itemName}
                                    />
                                    <ItemName>{equippedItem.item.itemName}</ItemName>
                                    <ItemDesc>슬롯 {equippedItem.equippedSlot}</ItemDesc>
                                </ItemCard>
                            ))}
                            {equippedItems.length === 0 && (
                                <div style={{ color: '#ccc', textAlign: 'center', padding: '1rem' }}>
                                    장착된 아이템이 없습니다
                                </div>
                            )}
                        </ItemList>
                    </ItemSection>

                    <Section>
                        <SectionTitle>장착된 스킨</SectionTitle>
                        <SkinSection>
                            {equippedSkins.slice && equippedSkins.slice.skin.actionType === 'S' && (
                                <SkinItem>
                                    <SkinInfo>
                                        <SkinImage
                                            src={`/assets/img/skins/${equippedSkins.slice.skin.skinImg}`}
                                            alt={equippedSkins.slice.skin.skinName || '슬라이스 스킨'}
                                        />
                                        <SkinName>{equippedSkins.slice.skin.skinName || '기본 슬라이스 스킨'}</SkinName>
                                    </SkinInfo>
                                    <Button onClick={onChangeSkin}>변경</Button>
                                </SkinItem>
                            )}
                            {stageInfo.isFinalStage === 'Y' &&
                                equippedSkins.tap &&
                                equippedSkins.tap.skin.actionType === 'T' && (
                                    <SkinItem>
                                        <SkinInfo>
                                            <SkinImage
                                                src={`/assets/img/skins/${equippedSkins.tap.skin.skinImg}`}
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
                    <Button
                        $primary
                        onClick={() => {
                            onStartGame();
                        }}
                    >
                        게임 시작
                    </Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default StageInfoModal;
