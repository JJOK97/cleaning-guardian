import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: ${({ theme }) => theme.colors.text.primary};
`;

const Title = styled.div`
    font-size: clamp(2rem, 5vw, 4rem);
    margin-bottom: 1rem;
    animation: ${fadeIn} 1s ease-in-out;
`;

const Subtitle = styled.div`
    font-size: clamp(1rem, 2vw, 1.5rem);
    opacity: 0.8;
    animation: ${fadeIn} 1s ease-in-out 0.5s both;
`;

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/main');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container>
            <Title>청소의 신</Title>
            <Subtitle>지구를 지켜라!</Subtitle>
        </Container>
    );
};

export default SplashScreen;
