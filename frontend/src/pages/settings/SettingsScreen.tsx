import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #87ceeb 0%, #98fb98 50%, #90ee90 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(135, 206, 235, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(152, 251, 152, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(144, 238, 144, 0.2) 0%, transparent 50%);
        pointer-events: none;
    }
`;

const SettingsCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;
`;

const Title = styled.h1`
    color: #2d5016;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 3rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 2px solid rgba(45, 80, 22, 0.1);

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const SettingLabel = styled.span`
    color: #2d5016;
    font-size: 1.2rem;
    font-weight: 600;
`;

const ToggleButton = styled.button<{ $isOn: boolean }>`
    background: ${({ $isOn }) =>
        $isOn ? 'linear-gradient(135deg, #4CAF50, #8BC34A)' : 'linear-gradient(135deg, #9E9E9E, #BDBDBD)'};
    border: none;
    border-radius: 25px;
    width: 60px;
    height: 30px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: ${({ $isOn }) => ($isOn ? '33px' : '3px')};
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:hover {
        transform: scale(1.05);
    }
`;

const LogoutButton = styled.button`
    width: 100%;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: white;
    border: none;
    border-radius: 16px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        sound: true,
        vibration: true,
    });

    const handleToggle = (setting: keyof typeof settings) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        navigate('/auth/login');
    };

    return (
        <Container>
            <SettingsCard>
                <Title>⚙️ 설정</Title>

                <SettingItem>
                    <SettingLabel>🔊 사운드</SettingLabel>
                    <ToggleButton
                        $isOn={settings.sound}
                        onClick={() => handleToggle('sound')}
                    />
                </SettingItem>

                <SettingItem>
                    <SettingLabel>📳 진동</SettingLabel>
                    <ToggleButton
                        $isOn={settings.vibration}
                        onClick={() => handleToggle('vibration')}
                    />
                </SettingItem>

                <SettingItem>
                    <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                </SettingItem>
            </SettingsCard>
        </Container>
    );
};

export default SettingsScreen;
