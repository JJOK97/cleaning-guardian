import React from 'react';
import { commonStyles } from '../../styles/common';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, style, ...props }) => {
    return (
        <button
            style={{
                ...commonStyles.button[variant],
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
