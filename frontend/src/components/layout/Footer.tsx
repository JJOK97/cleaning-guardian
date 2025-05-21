import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

const noiseSvgOne = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <filter id="noise1"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#noise1)" opacity="0.06"/>
    </svg>
  `);
const noiseSvgTwo = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <filter id="noise2"><feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#noise2)" opacity="0.04"/>
    </svg>
  `);

const StyledFooter = styled.footer`
    height: 4.2rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    background-color: #fff8b7;
    background-image: linear-gradient(
            to right,
            rgba(255, 252, 200, 0.6),
            rgba(255, 246, 160, 0.6) 30%,
            rgba(255, 249, 183, 0.4) 70%,
            rgba(254, 244, 150, 0.6)
        ),
        url('data:image/svg+xml;utf8,${noiseSvgOne}'), url('data:image/svg+xml;utf8,${noiseSvgTwo}');
    background-blend-mode: overlay, normal, normal;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
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
    min-width: ${({ $isActive }) => ($isActive ? '24%' : '19%')};
    transition: background 0.4s, box-shadow 0.2s, min-width 0.3s;
    box-shadow: none;
    border: 1.5px solid rgba(0, 0, 0, 0.06);
`;

const IconImg = styled.img<{ $isActive?: boolean }>`
    width: ${({ $isActive }) => ($isActive ? '4.7rem' : '3.0rem')};
    height: ${({ $isActive }) => ($isActive ? '4.7rem' : '3.0rem')};
    transition: width 0.22s, height 0.22s, filter 0.2s, transform 0.22s;
    filter: ${({ $isActive }) => ($isActive ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.18))' : 'none')};
    z-index: 2;
    margin-bottom: 0.3rem;
    margin-top: ${({ $isActive }) => ($isActive ? '-1.2rem' : '0')};
    transform: ${({ $isActive }) => ($isActive ? 'translateY(-0.7rem) scale(1.12)' : 'none')};
`;

const TextImg = styled.img`
    height: 1.1rem;
    margin-top: -1.8rem;
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
