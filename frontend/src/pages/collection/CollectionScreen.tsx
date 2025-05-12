import React from 'react';

interface TrashItem {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    discovered: boolean;
}

const trashItems: TrashItem[] = [
    {
        id: 'plastic-bottle',
        name: '플라스틱 병',
        description: '해양 생물에게 치명적인 위험을 주는 플라스틱 병입니다.',
        image: '🥤',
        category: '플라스틱',
        discovered: true,
    },
    {
        id: 'plastic-bag',
        name: '비닐봉지',
        description: '분해되는데 수백 년이 걸리는 비닐봉지입니다.',
        image: '🛍️',
        category: '플라스틱',
        discovered: true,
    },
    {
        id: 'straw',
        name: '플라스틱 빨대',
        description: '작은 크기지만 환경에 큰 영향을 미치는 플라스틱 빨대입니다.',
        image: '🥤',
        category: '플라스틱',
        discovered: false,
    },
];

const CollectionScreen: React.FC = () => {
    const categories = Array.from(new Set(trashItems.map((item) => item.category)));

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
                쓰레기 도감
            </h1>

            {categories.map((category) => (
                <div key={category}>
                    <h2
                        style={{
                            color: '#fff',
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {category}
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {trashItems
                            .filter((item) => item.category === category)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: item.discovered ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                                        border: `1px solid ${
                                            item.discovered ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                                        }`,
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
                                            color: item.discovered
                                                ? 'rgba(255, 255, 255, 0.8)'
                                                : 'rgba(255, 255, 255, 0.4)',
                                            textAlign: 'center',
                                            margin: 0,
                                        }}
                                    >
                                        {item.discovered ? item.description : '??? 발견되지 않음'}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CollectionScreen;
