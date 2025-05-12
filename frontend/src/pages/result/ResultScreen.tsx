import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ResultScreenProps {
    score?: number;
    stars?: number;
    isSuccess?: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score = 0, stars = 0, isSuccess = true }) => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
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
                    alignItems: 'center',
                    gap: '1.5rem',
                    maxWidth: '500px',
                    width: '100%',
                }}
            >
                <h1
                    style={{
                        color: '#fff',
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        margin: 0,
                    }}
                >
                    {isSuccess ? '스테이지 클리어!' : '게임 오버'}
                </h1>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    {[1, 2, 3].map((star) => (
                        <span
                            key={star}
                            style={{
                                fontSize: '2rem',
                                color: star <= stars ? '#FFD700' : 'rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            ⭐
                        </span>
                    ))}
                </div>

                <div
                    style={{
                        color: '#fff',
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                    }}
                >
                    최종 점수: {score}
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        width: '100%',
                    }}
                >
                    <button
                        onClick={() => navigate('/main')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                    >
                        메인으로
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: '#4CAF50',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = '#45a049')}
                        onMouseOut={(e) => (e.currentTarget.style.background = '#4CAF50')}
                    >
                        다시하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;
