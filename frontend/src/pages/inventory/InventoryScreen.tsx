import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    text-align: center;
`;

const InventoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

const ItemCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const ItemIcon = styled.div`
    font-size: 2rem;
`;

const ItemName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1rem;
    text-align: center;
`;

const ItemCount = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
`;

const InventoryScreen: React.FC = () => {
    const navigate = useNavigate();

    const inventory = [
        {
            id: 1,
            name: '플라스틱 병',
            icon: '🥤',
            count: 5,
        },
        {
            id: 2,
            name: '비닐봉지',
            icon: '🛍️',
            count: 3,
        },
        {
            id: 3,
            name: '플라스틱 빨대',
            icon: '🥤',
            count: 10,
        },
    ];

    return (
        <Container>
            <Title>인벤토리</Title>
            <InventoryGrid>
                {inventory.map((item) => (
                    <ItemCard key={item.id}>
                        <ItemIcon>{item.icon}</ItemIcon>
                        <ItemName>{item.name}</ItemName>
                        <ItemCount>보유: {item.count}개</ItemCount>
                    </ItemCard>
                ))}
            </InventoryGrid>
            <ButtonGroup>
                <Button
                    $variant='secondary'
                    onClick={() => navigate('/shop')}
                >
                    상점으로
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default InventoryScreen;
