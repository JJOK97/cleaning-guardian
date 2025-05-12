import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
`;

const SettingsCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const SettingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

    &:last-child {
        border-bottom: none;
    }
`;

const SettingLabel = styled.span`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.1rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
`;

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        sound: true,
        vibration: true,
        darkMode: false,
        difficulty: 'normal',
    });

    const handleToggle = (setting: keyof typeof settings) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    const handleDifficultyChange = (difficulty: string) => {
        setSettings((prev) => ({
            ...prev,
            difficulty,
        }));
    };

    const handleSave = () => {
        // TODO: 설정 저장 로직 구현
        navigate('/main');
    };

    const handleReset = () => {
        setSettings({
            sound: true,
            vibration: true,
            darkMode: false,
            difficulty: 'normal',
        });
    };

    return (
        <Container>
            <SettingsCard>
                <Title>설정</Title>

                <SettingItem>
                    <SettingLabel>사운드</SettingLabel>
                    <Button
                        $variant={settings.sound ? 'primary' : 'secondary'}
                        onClick={() => handleToggle('sound')}
                    >
                        {settings.sound ? '켜짐' : '꺼짐'}
                    </Button>
                </SettingItem>

                <SettingItem>
                    <SettingLabel>진동</SettingLabel>
                    <Button
                        $variant={settings.vibration ? 'primary' : 'secondary'}
                        onClick={() => handleToggle('vibration')}
                    >
                        {settings.vibration ? '켜짐' : '꺼짐'}
                    </Button>
                </SettingItem>

                <SettingItem>
                    <SettingLabel>다크 모드</SettingLabel>
                    <Button
                        $variant={settings.darkMode ? 'primary' : 'secondary'}
                        onClick={() => handleToggle('darkMode')}
                    >
                        {settings.darkMode ? '켜짐' : '꺼짐'}
                    </Button>
                </SettingItem>

                <SettingItem>
                    <SettingLabel>난이도</SettingLabel>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['easy', 'normal', 'hard'].map((difficulty) => (
                            <Button
                                key={difficulty}
                                $variant={settings.difficulty === difficulty ? 'primary' : 'secondary'}
                                onClick={() => handleDifficultyChange(difficulty)}
                            >
                                {difficulty === 'easy' ? '쉬움' : difficulty === 'normal' ? '보통' : '어려움'}
                            </Button>
                        ))}
                    </div>
                </SettingItem>

                <ButtonGroup>
                    <Button
                        $variant='primary'
                        onClick={handleSave}
                    >
                        저장
                    </Button>
                    <Button
                        $variant='secondary'
                        onClick={handleReset}
                    >
                        초기화
                    </Button>
                </ButtonGroup>
            </SettingsCard>
        </Container>
    );
};

export default SettingsScreen;
