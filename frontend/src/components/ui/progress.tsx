import React from 'react';

interface ProgressProps {
    value: number;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
    return (
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
            <div className='h-full bg-primary transition-all duration-300' style={{ width: `${value}%` }} />
        </div>
    );
};
