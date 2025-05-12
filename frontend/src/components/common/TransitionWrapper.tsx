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

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`;

const Container = styled.div<{ isVisible: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background.overlay};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.3s ease-out;
    pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
`;

const Wrapper = styled.div<{ $isVisible: boolean }>`
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '20px')});
    transition: all 0.3s ease;
`;

interface TransitionWrapperProps {
    $isVisible: boolean;
    children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ $isVisible, children }) => {
    return <Wrapper $isVisible={$isVisible}>{children}</Wrapper>;
};

export default TransitionWrapper;
