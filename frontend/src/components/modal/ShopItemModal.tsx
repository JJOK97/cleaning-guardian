import React from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { purchaseItem, useItem, equipItem, unequipItem } from '@/api/game';
import { useAuth } from '@/hooks/useAuth';

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
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 16px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const ItemImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin: 0 auto;
`;

const ItemName = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
`;

const ItemDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    margin: 0;
`;

const ItemPrice = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
`;

interface ShopItemModalProps {
    item: {
        itemIdx: number;
        itemName: string;
        itemImg: string;
        itemPrice: number;
        priceType: 'P' | 'C';
        isOwned: boolean;
        isEquipped: boolean;
    };
    onClose: () => void;
    onPurchase: () => void;
}

const ShopItemModal: React.FC<ShopItemModalProps> = ({ item, onClose, onPurchase }) => {
    const { user } = useAuth();

    const handlePurchase = async () => {
        try {
            if (user?.email) {
                await purchaseItem(user.email, item.itemIdx);
                onPurchase();
                onClose();
            }
        } catch (error) {
            console.error('구매 실패:', error);
        }
    };

    const handleUse = async () => {
        try {
            if (user?.email) {
                await useItem(user.email, item.itemIdx);
                onPurchase();
                onClose();
            }
        } catch (error) {
            console.error('사용 실패:', error);
        }
    };

    const handleEquip = async () => {
        try {
            if (user?.email) {
                if (item.isEquipped) {
                    await unequipItem(user.email, item.itemIdx);
                } else {
                    await equipItem(user.email, item.itemIdx, 0); // 기본 슬롯 0 사용
                }
                onPurchase();
                onClose();
            }
        } catch (error) {
            console.error('장착 실패:', error);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ItemImage
                    src={`/src/assets/img/items/${item.itemImg}.png`}
                    alt={item.itemName}
                />
                <ItemName>{item.itemName}</ItemName>
                <ItemDescription>
                    {item.priceType === 'P' ? '포인트' : '캐시'}로 구매할 수 있는 아이템입니다.
                </ItemDescription>
                <ItemPrice>
                    {item.priceType === 'P' ? '포인트' : '캐시'} {item.itemPrice}
                </ItemPrice>
                <ButtonGroup>
                    {!item.isOwned ? (
                        <Button
                            $variant='primary'
                            onClick={handlePurchase}
                        >
                            구매하기
                        </Button>
                    ) : (
                        <>
                            <Button
                                $variant='primary'
                                onClick={handleUse}
                            >
                                사용하기
                            </Button>
                            <Button
                                $variant={item.isEquipped ? 'secondary' : 'primary'}
                                onClick={handleEquip}
                            >
                                {item.isEquipped ? '해제하기' : '장착하기'}
                            </Button>
                        </>
                    )}
                    <Button
                        $variant='secondary'
                        onClick={onClose}
                    >
                        닫기
                    </Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ShopItemModal;
