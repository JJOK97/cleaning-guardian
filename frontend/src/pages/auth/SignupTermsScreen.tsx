import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/splash/SpaceBackground';
import guardianImg from '@/assets/img/guardian.png';
import { fixedStars, spaceParticles, planets, planetRings, cleaningIcons } from '@/pages/splash/constants';
import {
    Container,
    BackgroundWrapper,
    Content,
    Guardian,
    Lightning,
    GuardianWrapper,
    LightningRotateWrapper,
    Title,
} from '@/styles/auth/AuthContainer';
import { Button, LinkRow, LinkBtn } from '@/styles/auth/AuthForm';
import { CheckboxRow, CheckboxLabel, Checkbox } from '@/styles/auth/AuthCheckbox';

const SignupTermsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [agreeService, setAgreeService] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [triedSubmit, setTriedSubmit] = useState(false);
    const [shakeService, setShakeService] = useState(false);
    const [shakePrivacy, setShakePrivacy] = useState(false);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setTriedSubmit(true);
        let needShake = false;
        if (!agreeService) {
            setShakeService(true);
            needShake = true;
        }
        if (!agreePrivacy) {
            setShakePrivacy(true);
            needShake = true;
        }
        if (!needShake && agreeService && agreePrivacy) {
            navigate('/auth/signup');
        }
    };

    React.useEffect(() => {
        if (shakeService) {
            const t = setTimeout(() => setShakeService(false), 200);
            return () => clearTimeout(t);
        }
    }, [shakeService]);
    React.useEffect(() => {
        if (shakePrivacy) {
            const t = setTimeout(() => setShakePrivacy(false), 200);
            return () => clearTimeout(t);
        }
    }, [shakePrivacy]);

    return (
        <Container>
            <BackgroundWrapper>
                <SpaceBackground
                    fixedStars={fixedStars}
                    spaceParticles={spaceParticles}
                    planets={planets}
                    planetRings={planetRings}
                    cleaningIcons={cleaningIcons}
                />
            </BackgroundWrapper>
            <Content>
                <Title>청소의 신</Title>
                <GuardianWrapper>
                    <LightningRotateWrapper $left={true as any}>
                        <Lightning>⚡</Lightning>
                    </LightningRotateWrapper>
                    <LightningRotateWrapper>
                        <Lightning>⚡</Lightning>
                    </LightningRotateWrapper>
                    <Guardian
                        src={guardianImg}
                        alt='guardian'
                    />
                </GuardianWrapper>
                <form
                    onSubmit={handleNext}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <CheckboxRow>
                        <CheckboxLabel
                            $error={triedSubmit && !agreeService}
                            $shake={shakeService}
                        >
                            <Checkbox
                                type='checkbox'
                                checked={agreeService}
                                onChange={(e) => setAgreeService(e.target.checked)}
                            />
                            서비스 이용약관 (필수)
                        </CheckboxLabel>
                        <CheckboxLabel
                            $error={triedSubmit && !agreePrivacy}
                            $shake={shakePrivacy}
                        >
                            <Checkbox
                                type='checkbox'
                                checked={agreePrivacy}
                                onChange={(e) => setAgreePrivacy(e.target.checked)}
                            />
                            개인정보 수집 및 이용 (필수)
                        </CheckboxLabel>
                        <CheckboxLabel>
                            <Checkbox
                                type='checkbox'
                                checked={agreeMarketing}
                                onChange={(e) => setAgreeMarketing(e.target.checked)}
                            />
                            마케팅 수신 동의 (선택)
                        </CheckboxLabel>
                    </CheckboxRow>
                    <Button type='submit'>동의하고 시작하기</Button>
                </form>
                <LinkRow>
                    이미 계정이 있으신가요?
                    <LinkBtn onClick={() => navigate('/auth/login')}>로그인</LinkBtn>
                </LinkRow>
            </Content>
        </Container>
    );
};

export default SignupTermsScreen;
