import React, { useState } from 'react';
import styled from 'styled-components';
import { UserItem } from '@/types/inventory';
import { UserSkinData } from '@/api/skins';

interface ItemDetailModalProps {
    isOpen: boolean;
    item: UserItem | UserSkinData | null;
    onClose: () => void;
    onEquip: (slot: number) => void;
    onUnequip: () => void;
    equippedItems: UserItem[];
    equippedSkin: UserSkinData | null;
    activeTab: 'items' | 'skins';
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    isOpen,
    item,
    onClose,
    onEquip,
    onUnequip,
    equippedItems,
    equippedSkin,
    activeTab,
}) => {
    const [selectedSlot, setSelectedSlot] = useState<number>(1);
    if (!isOpen || !item) return null;

    const isItem = 'item' in item;
    const isEquipped = isItem
        ? equippedItems.some((eq) => eq.itemIdx === (item as UserItem).itemIdx)
        : equippedSkin?.skinIdx === (item as UserSkinData).skinIdx;

    // 스킨 데이터 구조 확인
    console.log('Modal item data:', item);
    console.log('Is item:', isItem);
    console.log('Is equipped:', isEquipped);
    if (!isItem) {
        console.log('Skin data:', (item as UserSkinData).skin);
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ItemImage
                    src={
                        isItem
                            ? (item as UserItem).item.itemImg
                            : (item as UserSkinData).skin?.skinImg || '/src/assets/img/skins/default.png'
                    }
                    alt={isItem ? (item as UserItem).item.itemName : (item as UserSkinData).skin?.skinName || '스킨'}
                />
                <ItemName>{isItem ? (item as UserItem).item.itemName : (item as UserSkinData).skin?.skinName || '스킨'}</ItemName>
                <ItemDescription>
                    {isItem ? (item as UserItem).item.itemDesc : (item as UserSkinData).skin?.skinDesc || '스킨 설명'}
                </ItemDescription>
                <ItemCount>{isItem ? `보유 수량: ${(item as UserItem).count}` : '보유'}</ItemCount>
                {isItem && !isEquipped && (
                    <SlotContainer>
                        <SlotLabel>장착 슬롯 선택:</SlotLabel>
                        <SlotButtons>
                            {[1, 2, 3].map((slot) => (
                                <SlotButton key={slot} $selected={selectedSlot === slot} onClick={() => setSelectedSlot(slot)}>
                                    {slot}
                                </SlotButton>
                            ))}
                        </SlotButtons>
                    </SlotContainer>
                )}
                <ButtonContainer>
                    {isEquipped ? (
                        <UnequipButton onClick={onUnequip}>장착 해제</UnequipButton>
                    ) : (
                        <EquipButton onClick={() => onEquip(selectedSlot)}>장착하기</EquipButton>
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.colors.background.card};
    padding: 2rem;
    border-radius: 12px;
    position: relative;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const ItemImage = styled.img`
    width: 120px;
    height: 120px;
    object-fit: contain;
`;

const ItemName = styled.h2`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text.primary};
    text-align: center;
`;

const ItemDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    line-height: 1.5;
`;

const ItemCount = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const EquipButton = styled.button`
    padding: 0.8rem 2rem;
    border-radius: 8px;
    border: none;
    background: ${({ theme }) => theme.colors.primary.main};
    color: white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const UnequipButton = styled(EquipButton)`
    background: ${({ theme }) => theme.colors.error.main};
`;

const SlotContainer = styled.div`
    margin: 10px 0;
    text-align: center;
`;

const SlotLabel = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
`;

const SlotButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const SlotButton = styled.button<{ $selected: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid ${(props) => (props.$selected ? '#4CAF50' : '#ddd')};
    background-color: ${(props) => (props.$selected ? '#4CAF50' : 'white')};
    color: ${(props) => (props.$selected ? 'white' : '#666')};
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #4caf50;
        color: #4caf50;
    }
`;

export default ItemDetailModal;
