import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import dogamImg from '@/assets/img/footer/dogam.png';
import dogamTextImg from '@/assets/img/footer/dogam-text.png';
import gabangImg from '@/assets/img/footer/gabang.png';
import gabangTextImg from '@/assets/img/footer/gabang-text.png';
import mapImg from '@/assets/img/footer/map.png';
import mapTextImg from '@/assets/img/footer/map-text.png';
import medalImg from '@/assets/img/footer/medal.png';
import medalTextImg from '@/assets/img/footer/medal-text.png';
import shopImg from '@/assets/img/footer/shop.png';
import shopTextImg from '@/assets/img/footer/shop-text.png';

const FOOTER_HEIGHT = '4.2rem';

const StyledFooter = styled.footer`
    height: 4.2rem;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: rgb(255 249 183);
    border-top: 1.5px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 -6px 24px 0 rgba(0, 0, 0, 0.12), 0 -1.5px 0 0 rgba(0, 0, 0, 0.04);
`;

const NavButton = styled.button<{ $isActive?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    height: 100%;
    min-width: 20%;
    transition: background 0.2s, box-shadow 0.2s, min-width 0.2s;
    box-shadow: none;
    border: 1.5px solid rgba(0, 0, 0, 0.06);
`;

const IconImg = styled.img<{ $isActive?: boolean }>`
    width: ${({ $isActive }) => ($isActive ? '4.7rem' : '3.0rem')};
    height: ${({ $isActive }) => ($isActive ? '4.7rem' : '3.0rem')};
    transition: width 0.22s, height 0.22s, filter 0.2s, transform 0.22s;
    filter: ${({ $isActive }) => ($isActive ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.18))' : 'none')};
    z-index: 2;
    margin-bottom: -0.7rem;
    margin-top: ${({ $isActive }) => ($isActive ? '-1.2rem' : '0')};
    transform: ${({ $isActive }) => ($isActive ? 'translateY(-0.7rem) scale(1.12)' : 'none')};
`;

const TextImg = styled.img`
    height: 0.95rem;
    margin-top: -0.7rem;
    margin-bottom: 0.2rem;
    transition: opacity 0.2s;
    z-index: 3;
    pointer-events: none;
`;

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            path: '/shop',
            icon: shopImg,
            text: shopTextImg,
            alt: '상점',
        },

        {
            path: '/inventory',
            icon: gabangImg,
            text: gabangTextImg,
            alt: '가방',
        },
        {
            path: '/main',
            icon: mapImg,
            text: mapTextImg,
            alt: '지도',
        },
        {
            path: '/collection',
            icon: dogamImg,
            text: dogamTextImg,
            alt: '도감',
        },
        {
            path: '/medal',
            icon: medalImg,
            text: medalTextImg,
            alt: '성과',
        },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <StyledFooter>
            {menuItems.map(({ path, icon, text, alt }) => {
                const active = isActive(path);
                return (
                    <NavButton
                        key={path}
                        $isActive={active}
                        onClick={() => navigate(path)}
                    >
                        <IconImg
                            src={icon}
                            alt={alt}
                            $isActive={active}
                        />
                        {active && text && (
                            <TextImg
                                src={text}
                                alt={alt + ' 텍스트'}
                            />
                        )}
                    </NavButton>
                );
            })}
        </StyledFooter>
    );
};

export default Footer;
