import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TapToStart } from '@/styles/components/splash/containers';
import { SpaceBackground } from '@/components/splash/SpaceBackground';
import { LoadingBar } from '@/components/splash/LoadingBar';
import { useSplashAnimation } from './hooks/useSplashAnimation';
import { useBGM } from '@/hooks/useBGM';
import { fixedStars, spaceParticles, planets, planetRings, cleaningIcons } from './constants';
import background from '@/assets/sounds/background.wav';

// Declare global type for the background music
declare global {
    interface Window {
        globalBgm?: HTMLAudioElement;
    }
}

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();
    const { progress, loadingComplete } = useSplashAnimation();
    const { play, setAudio } = useBGM({ type: 'splash', volume: 0.3 });

    React.useEffect(() => {
        // Create global reference for background music but don't autoplay
        if (!window.globalBgm) {
            window.globalBgm = new Audio(background);
            window.globalBgm.volume = 0.3;
            window.globalBgm.loop = true;
        }

        setAudio(window.globalBgm);
    }, [setAudio]);

    const handleTapToStart = () => {
        // Start playing music on user interaction
        const audio = new Audio(background);
        play(audio);

        // Navigate to login page
        navigate('/login');
    };

    return (
        <Container>
            <SpaceBackground
                fixedStars={fixedStars}
                spaceParticles={spaceParticles}
                planets={planets}
                planetRings={planetRings}
                cleaningIcons={cleaningIcons}
            />

            {!loadingComplete ? (
                <LoadingBar progress={progress} />
            ) : (
                <TapToStart onClick={handleTapToStart}>탭하여 게임 시작</TapToStart>
            )}
        </Container>
    );
};

export default SplashScreen;
