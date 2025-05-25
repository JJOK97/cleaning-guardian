import React from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { purchaseSkin } from '@/api/skins';
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

const SkinImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin: 0 auto;
`;

const SkinName = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
`;

const SkinDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    margin: 0;
`;

const SkinPrice = styled.div`
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

interface ShopSkinModalProps {
    skin: {
        skinIdx: number;
        skinName: string;
        skinImg: string;
        skinPrice: number;
        priceType: 'P' | 'C';
        actionType: 'S' | 'T';
        isOwned: boolean;
        isEquipped: boolean;
    };
    onClose: () => void;
    onPurchase: () => void;
}

const ShopSkinModal: React.FC<ShopSkinModalProps> = ({ skin, onClose, onPurchase }) => {
    const { user } = useAuth();

    const handlePurchase = async () => {
        try {
            if (user?.email) {
                await purchaseSkin(user.email, skin.skinIdx);
                onPurchase();
                onClose();
            }
        } catch (error) {
            console.error('구매 실패:', error);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <SkinImage src={skin.skinImg} alt={skin.skinName} />
                <SkinName>{skin.skinName}</SkinName>
                <SkinDescription>
                    {skin.actionType === 'S' ? '슬라이스' : '탭'} 스킨입니다.
                    {skin.priceType === 'P' ? '포인트' : '캐시'}로 구매할 수 있습니다.
                </SkinDescription>
                <SkinPrice>
                    {skin.priceType === 'P' ? '포인트' : '캐시'} {skin.skinPrice}
                </SkinPrice>
                <ButtonGroup>
                    {!skin.isOwned ? (
                        <Button $variant='primary' onClick={handlePurchase}>
                            구매하기
                        </Button>
                    ) : (
                        <Button $variant='secondary' onClick={onClose}>
                            보유중
                        </Button>
                    )}
                    <Button $variant='secondary' onClick={onClose}>
                        닫기
                    </Button>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ShopSkinModal;
