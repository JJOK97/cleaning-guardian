import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/splash/SpaceBackground';
import guardianImg from '@/assets/img/profile/default.png';
import { login } from '@/api/auth';
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
} from '@/styles/auth/AuthContainer';
import { Input, Button, LinkRow, LinkBtn } from '@/styles/auth/AuthForm';
import { Title } from '@/styles/auth/AuthContainer';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const deviceId = getDeviceId();

            const res = await login({ email, password, deviceId });
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('email', email);
                navigate('/main'); // TODO: 메인화면 경로로 수정
            } else {
                console.log(res.data.message || '로그인 실패');
            }
        } catch (err: any) {
            console.log(err.response?.data?.message || '서버 오류');
        } finally {
            setLoading(false);
        }
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
                    onSubmit={handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}
                >
                    <Input
                        type='email'
                        name='login-email'
                        placeholder='이메일'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete='off'
                    />
                    <Input
                        type='password'
                        name='login-password'
                        placeholder='비밀번호'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete='off'
                    />
                    <Button
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>
                <LinkRow>
                    <LinkBtn onClick={() => navigate('/auth/signup/terms')}>회원가입</LinkBtn>
                    <LinkBtn>비밀번호 찾기</LinkBtn>
                </LinkRow>
            </Content>
        </Container>
    );
};

export default LoginScreen;
