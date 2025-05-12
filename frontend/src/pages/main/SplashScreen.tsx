import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/colors';

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
                backgroundColor: colors.background.main,
            }}
        >
            <div
                style={{
                    color: colors.text.primary,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                }}
            >
                클리닝 가디언
            </div>
            <div
                style={{
                    color: colors.text.secondary,
                    marginTop: '1rem',
                }}
            >
                지구를 지켜라!
            </div>
        </div>
    );
};

export default SplashScreen;
