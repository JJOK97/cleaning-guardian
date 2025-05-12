import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';
import { vibrationManager } from '../../utils/vibration';

const SettingsScreen: React.FC = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

    const handleMuteToggle = () => {
        const newMuted = soundManager.toggleMute();
        setIsMuted(newMuted);
        vibrationManager.click();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        soundManager.setVolume(newVolume);
        vibrationManager.click();
    };

    const handleVibrationToggle = () => {
        setIsVibrationEnabled(!isVibrationEnabled);
        vibrationManager.click();
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    maxWidth: '500px',
                    width: '100%',
                }}
            >
                <h1
                    style={{
                        color: '#fff',
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        margin: 0,
                        textAlign: 'center',
                    }}
                >
                    설정
                </h1>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>소리</span>
                        <button
                            onClick={handleMuteToggle}
                            style={{
                                padding: '0.5rem 1rem',
                                background: isMuted ? '#f44336' : '#4CAF50',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>볼륨</span>
                        <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.1'
                            value={volume}
                            onChange={handleVolumeChange}
                            style={{
                                width: '100%',
                                height: '4px',
                                background: '#4CAF50',
                                borderRadius: '2px',
                                outline: 'none',
                                WebkitAppearance: 'none',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>진동</span>
                        <button
                            onClick={handleVibrationToggle}
                            style={{
                                padding: '0.5rem 1rem',
                                background: isVibrationEnabled ? '#4CAF50' : '#f44336',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {isVibrationEnabled ? '📳' : '📴'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
