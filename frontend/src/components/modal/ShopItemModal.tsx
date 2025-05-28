import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@/components/common/Button';
import { purchaseItem, useItem, equipItem, unequipItem } from '@/api/game';
import { useAuth } from '@/hooks/useAuth';

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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 50%, #e9ecef 100%);
    border-radius: 24px;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 3px solid #ced4da;
    box-shadow: 0 20px 60px rgba(108, 117, 125, 0.3);
    backdrop-filter: blur(20px);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #adb5bd, #ced4da, #adb5bd);
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
    background: linear-gradient(135deg, #868e96 0%, #adb5bd 100%);
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
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
    z-index: 10;

    &:hover {
        transform: scale(1.1) rotate(90deg);
        box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
    }
`;

const ItemImageContainer = styled.div`
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    border-radius: 20px;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #ced4da;
    box-shadow: 0 8px 24px rgba(108, 117, 125, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(45deg, #ced4da, #adb5bd, #ced4da);
        border-radius: 24px;
        z-index: -1;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
        border-radius: 16px;
    }
`;

const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(108, 117, 125, 0.2));
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1) rotate(5deg);
    }
`;

const ItemTitle = styled.h2`
    color: #495057;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(73, 80, 87, 0.1);
`;

const ItemDescription = styled.p`
    color: #6c757d;
    font-size: 1rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
    line-height: 1.5;
    background: rgba(255, 255, 255, 0.5);
    padding: 1rem;
    border-radius: 12px;
    border: 2px solid rgba(206, 212, 218, 0.3);
`;

const PriceContainer = styled.div<{ $priceType: 'P' | 'C' }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: ${
        ({ $priceType }) =>
            $priceType === 'C'
                ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' // 밝은 파랑
                : 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' // 밝은 노랑
    };
    border-radius: 16px;
    border: 3px solid rgba(255, 255, 255, 0.5);
    box-shadow: ${({ $priceType }) =>
        $priceType === 'C' ? '0 6px 20px rgba(96, 165, 250, 0.4)' : '0 6px 20px rgba(252, 211, 77, 0.4)'};
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
        border-radius: 13px;
    }
`;

const PriceIcon = styled.img`
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const PriceText = styled.span`
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    ${({ $variant }) =>
        $variant === 'primary'
            ? `
        background: linear-gradient(135deg, #868E96 0%, #ADB5BD 100%);
        color: white;
        border: 3px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    `
            : `
        background: rgba(255, 255, 255, 0.8);
        color: #495057;
        border: 3px solid rgba(206, 212, 218, 0.5);
        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.15);
    `}

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
        ${({ $variant }) =>
            $variant === 'primary'
                ? `
            box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
            background: linear-gradient(135deg, #6C757D 0%, #868E96 100%);
        `
                : `
            box-shadow: 0 6px 16px rgba(108, 117, 125, 0.2);
            background: rgba(255, 255, 255, 0.9);
        `}

        &::before {
            left: 100%;
        }
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
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
                <CloseButton onClick={onClose}>×</CloseButton>

                <ItemImageContainer>
                    <ItemImage
                        src={`/assets/img/items/${item.itemImg}.png`}
                        alt={item.itemName}
                        onError={(e) => {
                            e.currentTarget.src = '/assets/img/items/default.png';
                        }}
                    />
                </ItemImageContainer>

                <ItemTitle>{item.itemName}</ItemTitle>
                <ItemDescription>
                    {item.priceType === 'P' ? '포인트' : '캐시'}로 구매할 수 있는 아이템입니다.
                </ItemDescription>

                <PriceContainer $priceType={item.priceType}>
                    <PriceIcon
                        src={item.priceType === 'P' ? '/assets/img/header/point.png' : '/assets/img/header/cash.png'}
                        alt={item.priceType === 'P' ? '포인트' : '캐시'}
                    />
                    <PriceText>{item.itemPrice}</PriceText>
                </PriceContainer>

                <ButtonContainer>
                    {!item.isOwned ? (
                        <ActionButton
                            $variant='primary'
                            onClick={handlePurchase}
                        >
                            구매하기
                        </ActionButton>
                    ) : (
                        <>
                            <ActionButton
                                $variant='primary'
                                onClick={handleUse}
                            >
                                사용하기
                            </ActionButton>
                            <ActionButton
                                $variant={item.isEquipped ? 'secondary' : 'primary'}
                                onClick={handleEquip}
                            >
                                {item.isEquipped ? '해제하기' : '장착하기'}
                            </ActionButton>
                        </>
                    )}
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ShopItemModal;
