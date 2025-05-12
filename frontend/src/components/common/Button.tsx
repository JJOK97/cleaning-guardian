import React from 'react';
import { buttonStyles } from '../../styles/components/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'medium', children, style, ...props }) => {
    return (
        <button
            style={{
                ...buttonStyles.base,
                ...buttonStyles.variants[variant],
                ...buttonStyles.sizes[size],
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
