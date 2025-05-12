import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease-in-out',
            }}
        >
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #4CAF50',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
            <p
                style={{
                    color: '#fff',
                    marginTop: '1rem',
                    fontSize: '1rem',
                }}
            >
                로딩중...
            </p>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingScreen;
