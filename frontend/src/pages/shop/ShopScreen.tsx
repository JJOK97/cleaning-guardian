import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
`;

const ShopCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const ItemGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const ItemCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.light};
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
`;

const ItemImage = styled.div`
    width: 100px;
    height: 100px;
    background-color: ${({ theme }) => theme.colors.background.main};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
`;

const ItemName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.1rem;
    margin: 0;
`;

const ItemPrice = styled.span`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
`;

interface ShopItem {
    id: number;
    name: string;
    price: number;
    icon: string;
}

const ShopScreen: React.FC = () => {
    const navigate = useNavigate();
    const [items] = useState<ShopItem[]>([
        { id: 1, name: '청소기 업그레이드', price: 1000, icon: '🧹' },
        { id: 2, name: '빗자루 업그레이드', price: 800, icon: '🧹' },
        { id: 3, name: '물뿌리개 업그레이드', price: 600, icon: '💧' },
        { id: 4, name: '장갑 업그레이드', price: 400, icon: '🧤' },
    ]);

    const handlePurchase = (itemId: number) => {
        // TODO: 구매 로직 구현
        console.log(`구매: ${itemId}`);
    };

    const handleBack = () => {
        navigate('/main');
    };

    return (
        <Container>
            <ShopCard>
                <Title>상점</Title>

                <ItemGrid>
                    {items.map((item) => (
                        <ItemCard key={item.id}>
                            <ItemImage>{item.icon}</ItemImage>
                            <ItemName>{item.name}</ItemName>
                            <ItemPrice>{item.price} 코인</ItemPrice>
                            <Button
                                $variant='primary'
                                onClick={() => handlePurchase(item.id)}
                            >
                                구매
                            </Button>
                        </ItemCard>
                    ))}
                </ItemGrid>

                <ButtonGroup>
                    <Button
                        $variant='secondary'
                        onClick={handleBack}
                    >
                        뒤로가기
                    </Button>
                </ButtonGroup>
            </ShopCard>
        </Container>
    );
};

export default ShopScreen;
