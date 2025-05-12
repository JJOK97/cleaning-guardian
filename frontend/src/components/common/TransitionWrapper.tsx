import React from 'react';

interface TransitionWrapperProps {
    children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
    return (
        <div
            style={{
                animation: 'fadeIn 0.3s ease-in-out',
                width: '100%',
                height: '100%',
            }}
        >
            {children}
            <style>
                {`
                    @keyframes fadeIn {
                        from { 
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default TransitionWrapper;
