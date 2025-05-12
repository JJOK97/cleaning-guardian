import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
    $variant?: 'primary' | 'secondary' | 'icon' | 'nav';
    $isActive?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    ${({ $variant }) =>
        $variant === 'primary' &&
        css`
            background-color: ${({ theme }) => theme.colors.primary.main};
            color: white;

            &:hover {
                background-color: ${({ theme }) => theme.colors.primary.dark};
            }
        `}

    ${({ $variant }) =>
        $variant === 'secondary' &&
        css`
            background-color: transparent;
            color: ${({ theme }) => theme.colors.text.primary};
            border: 1px solid ${({ theme }) => theme.colors.border.primary};

            &:hover {
                background-color: ${({ theme }) => theme.colors.background.light};
            }
        `}

    ${({ $variant }) =>
        $variant === 'icon' &&
        css`
            background-color: transparent;
            padding: 0.5rem;
            font-size: 1.5rem;
            line-height: 1;

            &:hover {
                transform: scale(1.1);
            }
        `}

    ${({ $variant }) =>
        $variant === 'nav' &&
        css`
            background: none;
            color: ${({ theme }) => theme.colors.text.primary};
            padding: 0.5rem;
            border-radius: 8px;
            width: 60px;

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        `}

    ${({ $isActive }) =>
        $isActive &&
        css`
            background-color: ${({ theme }) => theme.colors.primary.main};
            color: white;
        `}
`;

const Button: React.FC<ButtonProps> = ({ $variant = 'primary', $isActive, onClick, children }) => {
    return (
        <StyledButton
            $variant={$variant}
            $isActive={$isActive}
            onClick={onClick}
        >
            {children}
        </StyledButton>
    );
};

export default Button;
