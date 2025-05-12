import React from 'react';
import { layoutStyles } from '../../styles/components/layout/layout';

interface LayoutProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
    return (
        <div
            style={{
                ...layoutStyles.mainLayout.container,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Layout;
