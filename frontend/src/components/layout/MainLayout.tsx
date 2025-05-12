import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
        >
            <Header />
            <main
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    paddingBottom: '80px', // Footer 높이만큼 여백 추가
                }}
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
