import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 3rem;
    text-align: center;
    margin: 0;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
`;

const MapGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    padding: 1rem;
`;

const MapCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-4px);
    }
`;

const MapIcon = styled.div`
    font-size: 3rem;
`;

const MapName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
`;

const MapDescription = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
`;

const MainScreen: React.FC = () => {
    const navigate = useNavigate();

    const maps = [
        {
            id: 'ocean',
            name: '바다',
            description: '플라스틱으로 오염된 바다를 정화하세요',
            icon: '🌊',
            unlocked: true,
        },
        {
            id: 'forest',
            name: '숲',
            description: '쓰레기로 오염된 숲을 정화하세요',
            icon: '🌲',
            unlocked: false,
        },
        {
            id: 'city',
            name: '도시',
            description: '미세먼지로 오염된 도시를 정화하세요',
            icon: '🏙️',
            unlocked: false,
        },
    ];

    return (
        <Container>
            <Title>맵 선택</Title>
            <MapGrid>
                {maps.map((map) => (
                    <MapCard
                        key={map.id}
                        onClick={() => map.unlocked && navigate(`/stage-select/${map.id}`)}
                    >
                        <MapIcon>{map.icon}</MapIcon>
                        <MapName>{map.name}</MapName>
                        <MapDescription>{map.description}</MapDescription>
                        {!map.unlocked && <span>🔒 잠겨있음</span>}
                    </MapCard>
                ))}
            </MapGrid>
        </Container>
    );
};

export default MainScreen;
