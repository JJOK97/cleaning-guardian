import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { layoutStyles } from '../../styles/components/layout/layout';
import { buttonStyles } from '../../styles/components/button';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/collection', label: '컬렉션', icon: '📚' },
        { path: '/inventory', label: '인벤토리', icon: '🎒' },
        { path: '/shop', label: '상점', icon: '🏪' },
    ];

    return (
        <footer style={layoutStyles.footer.container}>
            {menuItems.map(({ path, label, icon }) => (
                <button
                    key={path}
                    onClick={() => navigate(path)}
                    style={{
                        ...buttonStyles.base,
                        ...buttonStyles.variants.nav,
                        ...(isActive(path) ? buttonStyles.variants.navActive : {}),
                    }}
                >
                    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                    <span style={{ fontSize: '0.8rem' }}>{label}</span>
                </button>
            ))}
        </footer>
    );
};

export default Footer;
