import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { UserItem } from '@/types/inventory';
import { UserSkinData } from '@/api/skins';

interface ItemDetailModalProps {
    isOpen: boolean;
    item: UserItem | UserSkinData | null;
    onClose: () => void;
    onEquip: (slot: number) => void;
    onUnequip: () => void;
    equippedItems: UserItem[];
    equippedSkins: { tap: UserSkinData | null; slice: UserSkinData | null };
    activeTab: 'items' | 'skins';
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

const sparkle = keyframes`
    0%, 100% {
        opacity: 0.7;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
    }
`;

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    isOpen,
    item,
    onClose,
    onEquip,
    onUnequip,
    equippedItems,
    equippedSkins,
    activeTab,
}) => {
    const [selectedSlot, setSelectedSlot] = useState<number>(1);
    if (!isOpen || !item) return null;

    const isItem = 'item' in item;

    // 스킨의 경우 탭/슬라이스 장착 상태 확인
    let isEquipped = false;
    let equippedType = '';

    if (isItem) {
        isEquipped = equippedItems.some((eq) => eq.itemIdx === (item as UserItem).itemIdx);
    } else {
        const skinData = item as UserSkinData;
        const isTapEquipped = equippedSkins.tap?.skinIdx === skinData.skinIdx;
        const isSliceEquipped = equippedSkins.slice?.skinIdx === skinData.skinIdx;

        if (isTapEquipped) {
            isEquipped = true;
            equippedType = '탭';
        } else if (isSliceEquipped) {
            isEquipped = true;
            equippedType = '슬라이스';
        }
    }

    // 스킨 데이터 구조 확인
    console.log('Modal item data:', item);
    console.log('Is item:', isItem);
    console.log('Is equipped:', isEquipped);
    if (!isItem) {
        console.log('Equipped type:', equippedType);
        console.log('Skin data:', (item as UserSkinData).skin);
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ItemImage
                    src={
                        isItem
                            ? `/assets/img/items/${(item as UserItem).item.itemImg}.png`
                            : `/assets/img/skins/${(item as UserSkinData).skin?.skinImg}` ||
                              '/assets/img/skins/default.png'
                    }
                    alt={isItem ? (item as UserItem).item.itemName : (item as UserSkinData).skin?.skinName || '스킨'}
                />
                <ItemName>
                    {isItem ? (item as UserItem).item.itemName : (item as UserSkinData).skin?.skinName || '스킨'}
                </ItemName>
                <ItemDescription>
                    {isItem ? (item as UserItem).item.itemDesc : (item as UserSkinData).skin?.skinDesc || '스킨 설명'}
                </ItemDescription>
                <ItemCount>
                    {isItem
                        ? `보유 수량: ${(item as UserItem).count}`
                        : isEquipped
                        ? `보유 (${equippedType} 장착됨)`
                        : '보유'}
                </ItemCount>
                {isItem && !isEquipped && (
                    <SlotContainer>
                        <SlotLabel>장착 슬롯 선택:</SlotLabel>
                        <SlotButtons>
                            {[1, 2, 3].map((slot) => (
                                <SlotButton
                                    key={slot}
                                    $selected={selectedSlot === slot}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    {slot}
                                </SlotButton>
                            ))}
                        </SlotButtons>
                    </SlotContainer>
                )}
                <ButtonContainer>
                    {isEquipped ? (
                        <UnequipButton onClick={onUnequip}>
                            {isItem ? '장착 해제' : `${equippedType} 장착 해제`}
                        </UnequipButton>
                    ) : (
                        <EquipButton onClick={() => onEquip(selectedSlot)}>
                            {isItem ? '장착하기' : '장착하기'}
                        </EquipButton>
                    )}
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    backdrop-filter: blur(8px);
    animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
    background: linear-gradient(135deg, #fff 0%, #fffbeb 50%, #fef3c7 100%);
    border-radius: 24px;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 3px solid #fcd34d;
    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.3);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #fcd34d, #f59e0b, #fcd34d);
        border-radius: 24px 24px 0 0;
    }

    &::after {
        content: '✨';
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        opacity: 0.7;
        animation: ${sparkle} 2s ease-in-out infinite;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    z-index: 10;

    &:hover {
        transform: scale(1.1) rotate(90deg);
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
    }
`;

const ItemImage = styled.img`
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 20px;
    background: linear-gradient(135deg, #fff 0%, #fef3c7 100%);
    padding: 1rem;
    border: 4px solid #fcd34d;
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
    filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.2));
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05) rotate(2deg);
    }
`;

const ItemName = styled.h2`
    font-size: 1.5rem;
    color: #92400e;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(146, 64, 14, 0.1);
    margin: 0;
`;

const ItemDescription = styled.p`
    color: #a16207;
    text-align: center;
    line-height: 1.5;
    background: rgba(252, 211, 77, 0.2);
    padding: 1rem;
    border-radius: 12px;
    border: 2px solid rgba(245, 158, 11, 0.3);
    margin: 0;
`;

const ItemCount = styled.div`
    color: #a16207;
    font-size: 0.9rem;
    background: rgba(252, 211, 77, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(245, 158, 11, 0.3);
    font-weight: 600;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
`;

const EquipButton = styled.button`
    flex: 1;
    padding: 1rem 1.5rem;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    font-size: 1rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
    border: 3px solid rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);

        &::before {
            left: 100%;
        }
    }

    &:active {
        transform: translateY(0);
    }
`;

const UnequipButton = styled(EquipButton)`
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);

    &:hover {
        box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
        background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
    }
`;

const SlotContainer = styled.div`
    margin: 10px 0;
    text-align: center;
    background: rgba(252, 211, 77, 0.1);
    padding: 1rem;
    border-radius: 16px;
    border: 2px solid rgba(245, 158, 11, 0.2);
`;

const SlotLabel = styled.div`
    font-size: 14px;
    color: #92400e;
    margin-bottom: 10px;
    font-weight: 600;
`;

const SlotButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const SlotButton = styled.button<{ $selected: boolean }>`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$selected ? '#F59E0B' : '#FCD34D')};
    background: ${(props) =>
        props.$selected
            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
            : 'linear-gradient(135deg, #fff 0%, #FEF3C7 100%)'};
    color: ${(props) => (props.$selected ? 'white' : '#92400E')};
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${(props) =>
        props.$selected ? '0 4px 12px rgba(245, 158, 11, 0.4)' : '0 2px 8px rgba(245, 158, 11, 0.2)'};

    &:hover {
        transform: translateY(-2px) scale(1.05);
        border-color: #f59e0b;
        box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
    }

    &:active {
        transform: translateY(0) scale(1);
    }
`;

export default ItemDetailModal;
