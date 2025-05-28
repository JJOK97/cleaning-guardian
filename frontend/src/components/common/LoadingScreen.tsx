import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(240, 253, 255);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    animation: ${fadeIn} 0.3s ease-out;
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 4px solid ${({ theme }) => theme.colors.background.light};
    border-top: 4px solid ${({ theme }) => theme.colors.primary.main};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

const Text = styled.div`
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 1.2rem;
    text-align: center;
`;

const LoadingScreen: React.FC = () => {
    return (
        <Container>
            <Spinner />
            <Text>로딩 중...</Text>
        </Container>
    );
};

export default LoadingScreen;
