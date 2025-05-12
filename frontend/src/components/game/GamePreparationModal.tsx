import React, { useState } from 'react';

interface PassiveItem {
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
}

interface GamePreparationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (selectedItems: string[]) => void;
    stageInfo: {
        name: string;
        description: string;
        difficulty: 'easy' | 'normal' | 'hard';
    };
}

const passiveItems: PassiveItem[] = [
    {
        id: 'double-score',
        name: '점수 2배',
        description: '획득하는 점수가 2배가 됩니다',
        image: '⭐',
        selected: false,
    },
    {
        id: 'slow-time',
        name: '시간 감속',
        description: '게임 시간이 1.5배 느려집니다',
        image: '⏰',
        selected: false,
    },
    {
        id: 'extra-life',
        name: '추가 생명',
        description: '생명이 1개 추가됩니다',
        image: '❤️',
        selected: false,
    },
];

const GamePreparationModal: React.FC<GamePreparationModalProps> = ({ isOpen, onClose, onStart, stageInfo }) => {
    const [items, setItems] = useState<PassiveItem[]>(passiveItems);

    const toggleItem = (itemId: string) => {
        setItems(items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)));
    };

    const handleStart = () => {
        const selectedItems = items.filter((item) => item.selected).map((item) => item.id);
        onStart(selectedItems);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(to bottom, #1A1A4F, #0B0B2B)',
                    borderRadius: '16px',
                    padding: '2rem',
                    width: '90%',
                    maxWidth: '500px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <h2 style={{ color: '#fff', marginTop: 0 }}>{stageInfo.name}</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{stageInfo.description}</p>

                <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>패시브 아이템 선택</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                style={{
                                    background: item.selected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                                    border: `1px solid ${
                                        item.selected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                                    }`,
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <span style={{ fontSize: '2rem' }}>{item.image}</span>
                                <h4 style={{ color: '#fff', margin: 0 }}>{item.name}</h4>
                                <p
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        margin: 0,
                                    }}
                                >
                                    {item.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '2rem',
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleStart}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: '#4CAF50',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
                    >
                        시작하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePreparationModal;
