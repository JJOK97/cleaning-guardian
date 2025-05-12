import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
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
        <Layout style={{ backgroundColor: colors.primary.main }}>
            <div
                style={{
                    color: colors.text.white,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                }}
            >
                청소의 신
            </div>
        </Layout>
    );
};

export default SplashScreen;
