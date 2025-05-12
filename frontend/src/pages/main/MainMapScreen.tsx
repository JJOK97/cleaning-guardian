import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import { commonStyles } from '../../styles/common';

const MainMapScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <h1 style={commonStyles.title}>청소의 신</h1>
            <Button onClick={() => navigate('/stage')}>게임 시작</Button>
        </Layout>
    );
};

export default MainMapScreen;
