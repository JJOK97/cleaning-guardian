import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.background.main};
`;

const Main = styled.main`
    flex: 1;
    padding: 1rem;
    padding-bottom: 5rem;
    overflow-y: auto;
`;

const MainLayout: React.FC = () => {
    return (
        <Container>
            <Header />
            <Main>
                <Outlet />
            </Main>
            <Footer />
        </Container>
    );
};

export default MainLayout;
