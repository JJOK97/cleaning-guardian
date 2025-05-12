import React from 'react';
import { useNavigate } from 'react-router-dom';
import { layoutStyles } from '../../styles/components/layout/layout';
import { buttonStyles } from '../../styles/components/button';

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header style={layoutStyles.header.container}>
            {/* 왼쪽: 스테이지 정보 */}
            <div style={layoutStyles.header.stageInfo}>
                <div style={layoutStyles.header.stageBadge}>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>스테이지 1</span>
                </div>
            </div>

            {/* 중앙: 보유 자원 */}
            <div style={layoutStyles.header.resources}>
                <div style={{ ...layoutStyles.header.resourceBadge, ...layoutStyles.header.coinBadge }}>
                    <span style={{ color: '#FFD700' }}>💰</span>
                    <span style={{ color: '#fff' }}>1,000</span>
                </div>
                <div style={{ ...layoutStyles.header.resourceBadge, ...layoutStyles.header.gemBadge }}>
                    <span style={{ color: '#9370DB' }}>💎</span>
                    <span style={{ color: '#fff' }}>50</span>
                </div>
            </div>

            {/* 오른쪽: 설정 */}
            <button
                onClick={() => navigate('/settings')}
                style={{
                    ...buttonStyles.base,
                    ...buttonStyles.variants.icon,
                }}
            >
                ⚙️
            </button>
        </header>
    );
};

export default Header;
