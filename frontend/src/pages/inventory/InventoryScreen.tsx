import React from 'react';

interface InventoryItem {
    id: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    type: 'consumable' | 'passive';
}

const inventoryItems: InventoryItem[] = [
    {
        id: 'double-score',
        name: '점수 2배',
        description: '획득하는 점수가 2배가 됩니다',
        image: '⭐',
        quantity: 3,
        type: 'consumable',
    },
    {
        id: 'slow-time',
        name: '시간 감속',
        description: '게임 시간이 1.5배 느려집니다',
        image: '⏰',
        quantity: 2,
        type: 'consumable',
    },
    {
        id: 'extra-life',
        name: '추가 생명',
        description: '생명이 1개 추가됩니다',
        image: '❤️',
        quantity: 1,
        type: 'consumable',
    },
];

const InventoryScreen: React.FC = () => {
    const types = Array.from(new Set(inventoryItems.map((item) => item.type)));

    return (
        <div
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <h1
                style={{
                    color: '#fff',
                    textAlign: 'center',
                    marginBottom: '1rem',
                }}
            >
                인벤토리
            </h1>

            {types.map((type) => (
                <div key={type}>
                    <h2
                        style={{
                            color: '#fff',
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {type === 'consumable' ? '소모품' : '패시브 아이템'}
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {inventoryItems
                            .filter((item) => item.type === type)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <span style={{ fontSize: '3rem' }}>{item.image}</span>
                                    <h3 style={{ color: '#fff', margin: 0 }}>{item.name}</h3>
                                    <p
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            textAlign: 'center',
                                            margin: 0,
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                    <div
                                        style={{
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        보유 수량: {item.quantity}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InventoryScreen;
