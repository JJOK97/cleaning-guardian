import { useRef, useEffect } from 'react';

type BGMType = 'splash' | 'game';

interface BGMConfig {
    type: BGMType;
    volume?: number;
    loop?: boolean;
}

export const useBGM = (config: BGMConfig) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 이전 BGM 정리
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const play = async (audio: HTMLAudioElement) => {
        try {
            audio.volume = config.volume || 0.3;
            audio.loop = config.loop ?? true;
            await audio.play();
        } catch (error) {
            console.error('BGM 재생 실패:', error);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const setAudio = (audio: HTMLAudioElement) => {
        audioRef.current = audio;
    };

    return {
        play,
        stop,
        setAudio,
        audioRef,
    };
};
