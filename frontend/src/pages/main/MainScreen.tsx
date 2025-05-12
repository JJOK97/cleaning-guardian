import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Map {
    id: string;
    name: string;
    description: string;
    image: string;
    unlocked: boolean;
}

const maps: Map[] = [
    {
        id: 'ocean',
        name: '바다',
        description: '플라스틱으로 오염된 바다를 정화하세요',
        image: '🌊',
        unlocked: true,
    },
    {
        id: 'forest',
        name: '숲',
        description: '쓰레기로 오염된 숲을 정화하세요',
        image: '🌲',
        unlocked: false,
    },
    {
        id: 'city',
        name: '도시',
        description: '미세먼지로 오염된 도시를 정화하세요',
        image: '🏙️',
        unlocked: false,
    },
];

const MainScreen: React.FC = () => {
    const navigate = useNavigate();

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
                청소의 신
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                }}
            >
                {maps.map((map) => (
                    <button
                        key={map.id}
                        onClick={() => map.unlocked && navigate(`/stage/${map.id}`)}
                        style={{
                            background: map.unlocked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                            border: `1px solid ${map.unlocked ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: map.unlocked ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => map.unlocked && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => map.unlocked && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <span style={{ fontSize: '3rem' }}>{map.image}</span>
                        <h2 style={{ color: '#fff', margin: 0 }}>{map.name}</h2>
                        <p
                            style={{
                                color: map.unlocked ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                                textAlign: 'center',
                                margin: 0,
                            }}
                        >
                            {map.description}
                        </p>
                        {!map.unlocked && (
                            <div
                                style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.9rem',
                                    marginTop: '0.5rem',
                                }}
                            >
                                🔒 잠겨있음
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainScreen;
