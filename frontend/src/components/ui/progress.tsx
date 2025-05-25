import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin: 8px 0;
`;

const ProgressBar = styled.div<{ $progress: number }>`
    width: ${({ $progress }) => `${$progress}%`};
    height: 100%;
    background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
    border-radius: 4px;
    transition: width 0.3s ease-in-out;
`;

interface ProgressProps {
    value: number;
    max?: number;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100 }) => {
    const progress = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <ProgressContainer>
            <ProgressBar $progress={progress} />
        </ProgressContainer>
    );
};
