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

const CollectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
`;

const CollectionCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-4px);
    }
`;

const ItemImage = styled.div`
    width: 100px;
    height: 100px;
    background-color: ${({ theme }) => theme.colors.background.light};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
`;

const ItemName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
    text-align: center;
`;

const ItemDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
    text-align: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
`;

const CollectionScreen: React.FC = () => {
    const navigate = useNavigate();

    const collections = [
        {
            id: 1,
            name: '플라스틱',
            description: '일회용 플라스틱 제품들',
            icon: '🥤',
        },
        {
            id: 2,
            name: '유리',
            description: '깨진 유리 조각들',
            icon: '🍶',
        },
        {
            id: 3,
            name: '금속',
            description: '녹슨 금속 조각들',
            icon: '🔧',
        },
    ];

    return (
        <Container>
            <Title>컬렉션</Title>
            <CollectionGrid>
                {collections.map((item) => (
                    <CollectionCard key={item.id}>
                        <ItemImage>{item.icon}</ItemImage>
                        <ItemName>{item.name}</ItemName>
                        <ItemDescription>{item.description}</ItemDescription>
                    </CollectionCard>
                ))}
            </CollectionGrid>
            <ButtonGroup>
                <Button
                    $variant='secondary'
                    onClick={() => navigate('/main')}
                >
                    메인으로
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default CollectionScreen;
