import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../common/Button';

const StyledFooter = styled.footer`
    padding: 0.5rem;
    display: flex;
    justify-content: space-around;
    background-color: ${({ theme }) => theme.colors.background.card};
    backdrop-filter: blur(10px);
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
`;

const NavButton = styled(Button)<{ $isActive?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary.main : 'transparent')};
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.text.primary : theme.colors.text.secondary)};
    border: none;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme, $isActive }) =>
            $isActive ? theme.colors.primary.main : theme.colors.background.light};
    }
`;

const Icon = styled.span`
    font-size: 1.5rem;
`;

const Label = styled.span`
    font-size: 0.8rem;
`;

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/main', label: '메인', icon: '🏠' },
        { path: '/collection', label: '컬렉션', icon: '📚' },
        { path: '/inventory', label: '인벤토리', icon: '🎒' },
        { path: '/shop', label: '상점', icon: '🏪' },
    ];

    return (
        <StyledFooter>
            {menuItems.map(({ path, label, icon }) => (
                <NavButton
                    key={path}
                    $variant='nav'
                    $isActive={isActive(path)}
                    onClick={() => navigate(path)}
                >
                    <span>{icon}</span>
                    <span>{label}</span>
                </NavButton>
            ))}
        </StyledFooter>
    );
};

export default Footer;
