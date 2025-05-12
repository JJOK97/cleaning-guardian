import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../common/Button';

const StyledHeader = styled.header`
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.card};
    backdrop-filter: blur(10px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const StageInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const StageBadge = styled.div`
    background-color: rgba(76, 175, 80, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(76, 175, 80, 0.3);
`;

const Resources = styled.div`
    display: flex;
    gap: 1rem;
`;

const ResourceBadge = styled.div<{ type: 'coin' | 'gem' }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    background-color: ${({ type }) => (type === 'coin' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(147, 112, 219, 0.2)')};
    border: 1px solid ${({ type }) => (type === 'coin' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(147, 112, 219, 0.3)')};
`;

const IconButton = styled(Button)`
    padding: 0.5rem;
    font-size: 1.5rem;
    line-height: 1;
    background: transparent;
    border: none;

    &:hover {
        transform: scale(1.1);
    }
`;

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <StyledHeader>
            {/* 왼쪽: 스테이지 정보 */}
            <StageInfo>
                <StageBadge>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>스테이지 1</span>
                </StageBadge>
            </StageInfo>

            {/* 중앙: 보유 자원 */}
            <Resources>
                <ResourceBadge type='coin'>
                    <span style={{ color: '#FFD700' }}>💰</span>
                    <span style={{ color: '#fff' }}>1,000</span>
                </ResourceBadge>
                <ResourceBadge type='gem'>
                    <span style={{ color: '#9370DB' }}>💎</span>
                    <span style={{ color: '#fff' }}>50</span>
                </ResourceBadge>
            </Resources>

            {/* 오른쪽: 설정 */}
            <IconButton
                $variant='icon'
                onClick={() => navigate('/settings')}
            >
                ⚙️
            </IconButton>
        </StyledHeader>
    );
};

export default Header;
