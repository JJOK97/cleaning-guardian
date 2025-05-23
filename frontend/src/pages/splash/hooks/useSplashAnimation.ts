import { useState, useEffect } from 'react';

export const useSplashAnimation = () => {
    const [progress, setProgress] = useState(0);
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        const loadingInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setLoadingComplete(true);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => {
            clearInterval(loadingInterval);
        };
    }, []);

    return {
        progress,
        loadingComplete,
    };
};
