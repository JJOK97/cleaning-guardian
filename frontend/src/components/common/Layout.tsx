import React from 'react';
import { commonStyles } from '../../styles/common';

interface LayoutProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({ children, style }) => {
    return (
        <div
            style={{
                ...commonStyles.fullScreen,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Layout;
