import React from 'react';
import { LoadingBarContainer, LoadingBarProgress, LoadingText } from '@/styles/components/splash/containers';

interface LoadingBarProps {
    progress: number;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
    return (
        <>
            <LoadingBarContainer>
                <LoadingBarProgress $progress={progress} />
            </LoadingBarContainer>
            <LoadingText>지구 오염물 스캔 중... {progress}%</LoadingText>
        </>
    );
};
