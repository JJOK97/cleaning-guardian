import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/main');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff',
            }}
        >
            <h1
                style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    marginBottom: '1rem',
                    animation: 'fadeIn 1s ease-in-out',
                }}
            >
                청소의 신
            </h1>
            <p
                style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    opacity: 0.8,
                    animation: 'fadeIn 1s ease-in-out 0.5s both',
                }}
            >
                지구를 깨끗하게 만들어보세요
            </p>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default SplashScreen;
