import React from 'react';
import styled from 'styled-components';

interface LayoutProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const StyledLayout = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.background.main};
`;

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
    return <StyledLayout style={style}>{children}</StyledLayout>;
};

export default Layout;
