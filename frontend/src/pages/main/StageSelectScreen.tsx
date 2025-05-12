import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Stage {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'normal' | 'hard';
    unlocked: boolean;
    stars: number;
}

const stages: Record<string, Stage[]> = {
    ocean: [
        {
            id: 'ocean-1',
            name: '해변가',
            description: '플라스틱 병과 비닐봉지를 제거하세요',
            difficulty: 'easy',
            unlocked: true,
            stars: 0,
        },
        {
            id: 'ocean-2',
            name: '얕은 바다',
            description: '플라스틱 빨대와 일회용 컵을 제거하세요',
            difficulty: 'normal',
            unlocked: false,
            stars: 0,
        },
        {
            id: 'ocean-3',
            name: '깊은 바다',
            description: '어망과 플라스틱 조각을 제거하세요',
            difficulty: 'hard',
            unlocked: false,
            stars: 0,
        },
    ],
    forest: [
        {
            id: 'forest-1',
            name: '숲 입구',
            description: '일회용 쓰레기를 제거하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
    ],
    city: [
        {
            id: 'city-1',
            name: '도시 공원',
            description: '미세먼지를 제거하세요',
            difficulty: 'easy',
            unlocked: false,
            stars: 0,
        },
    ],
};

const difficultyColors = {
    easy: '#4CAF50',
    normal: '#FFC107',
    hard: '#F44336',
};

const StageSelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mapId } = useParams<{ mapId: string }>();
    const mapStages = stages[mapId || ''] || [];

    return (
        <div
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}
            >
                <button
                    onClick={() => navigate('/main')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                    }}
                >
                    ←
                </button>
                <h1 style={{ color: '#fff', margin: 0 }}>
                    {mapId === 'ocean' ? '바다' : mapId === 'forest' ? '숲' : '도시'}
                </h1>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem',
                }}
            >
                {mapStages.map((stage) => (
                    <button
                        key={stage.id}
                        onClick={() => stage.unlocked && navigate(`/game/${stage.id}`)}
                        style={{
                            background: stage.unlocked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
                            border: `1px solid ${
                                stage.unlocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                            }`,
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            cursor: stage.unlocked ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => stage.unlocked && (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseOut={(e) => stage.unlocked && (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h2 style={{ color: '#fff', margin: 0 }}>{stage.name}</h2>
                            <div
                                style={{
                                    color: difficultyColors[stage.difficulty],
                                    fontSize: '0.9rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    background: `${difficultyColors[stage.difficulty]}20`,
                                }}
                            >
                                {stage.difficulty === 'easy'
                                    ? '쉬움'
                                    : stage.difficulty === 'normal'
                                    ? '보통'
                                    : '어려움'}
                            </div>
                        </div>
                        <p
                            style={{
                                color: stage.unlocked ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                                margin: 0,
                            }}
                        >
                            {stage.description}
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '0.5rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.25rem',
                                }}
                            >
                                {[1, 2, 3].map((star) => (
                                    <span
                                        key={star}
                                        style={{
                                            color: star <= stage.stars ? '#FFD700' : 'rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        ⭐
                                    </span>
                                ))}
                            </div>
                            {!stage.unlocked && (
                                <div
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    🔒 잠겨있음
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StageSelectScreen;
