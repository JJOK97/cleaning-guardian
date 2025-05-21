import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TapToStart } from '@/styles/components/splash/containers';
import { SpaceBackground } from '@/components/splash/SpaceBackground';
import { LoadingBar } from '@/components/splash/LoadingBar';
import { useSplashAnimation } from './hooks/useSplashAnimation';
import { fixedStars, spaceParticles, planets, planetRings, cleaningIcons } from './constants';
import SoundManager from '@/utils/sound';

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();
    const { progress, loadingComplete } = useSplashAnimation();
    const soundManager = SoundManager.getInstance();

    const handleTapToStart = () => {
        // BGM 재생
        soundManager.play('background');

        // 로그인 페이지로 이동
        navigate('/auth/login');
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
