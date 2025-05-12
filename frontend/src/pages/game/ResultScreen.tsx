import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import { commonStyles } from '../../styles/common';
import { GameResult } from '../../types/game';

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state as GameResult;

    return (
        <Layout>
            <h1 style={commonStyles.title}>게임 결과</h1>
            <div
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: commonStyles.title.color,
                }}
            >
                {result?.score || 0}점
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                }}
            >
                <Button onClick={() => navigate('/stage')}>다시하기</Button>
                <Button
                    variant='secondary'
                    onClick={() => navigate('/main')}
                >
                    메인으로
                </Button>
            </div>
        </Layout>
    );
};

export default ResultScreen;
