import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/splash/SpaceBackground';
import guardianImg from '@/assets/img/profile/default.png';
import { signup } from '@/api/auth';
import { getDeviceId } from '@/utils/device';
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
import { Input, Button, LinkRow, LinkBtn } from '@/styles/auth/AuthForm';

const SignupScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [shakeEmail, setShakeEmail] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const deviceId = getDeviceId();
            const res = await signup({ email, password, nickname, deviceId });
            if (res.data.success) {
                navigate('/auth/login');
            } else {
                if (res.data.message?.includes('이미 등록된 이메일')) {
                    setEmailError(true);
                    setShakeEmail(true);
                    setEmail('');
                    setTimeout(() => setShakeEmail(false), 200);
                }
                console.log(res.data.message || '회원가입 실패');
            }
        } catch (err: any) {
            if (err.response?.data?.message?.includes('이미 등록된 이메일')) {
                setEmailError(true);
                setShakeEmail(true);
                setEmail('');
                setTimeout(() => setShakeEmail(false), 200);
            }
            console.log(err.response?.data?.message || '서버 오류');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailFocus = () => {
        setEmailError(false);
    };

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
            <Content style={{ position: 'relative' }}>
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
                    onSubmit={handleSignup}
                    style={{ marginTop: '1em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <Input
                        type='email'
                        placeholder={emailError ? '이미 등록된 이메일입니다.' : '이메일'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete='off'
                        $error={emailError}
                        $shake={shakeEmail}
                        onFocus={handleEmailFocus}
                    />
                    <Input
                        type='password'
                        placeholder='비밀번호'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete='off'
                    />
                    <Input
                        type='text'
                        placeholder='닉네임'
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        autoComplete='off'
                    />
                    <Button
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? '가입 중...' : '회원가입'}
                    </Button>
                </form>
                <LinkRow>
                    이미 계정이 있으신가요?
                    <LinkBtn onClick={() => navigate('/auth/login')}>로그인</LinkBtn>
                </LinkRow>
            </Content>
        </Container>
    );
};

export default SignupScreen;
