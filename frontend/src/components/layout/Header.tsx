import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import pointImg from '@/assets/img/header/point.png';
import cashImg from '@/assets/img/header/cash.png';
import settingImg from '@/assets/img/header/setting.png';
import defaultProfileImg from '@/assets/img/profile/default.png';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, getUserBalance } from '@/api/user';
import number0 from '@/assets/img/number/0.png';
import number1 from '@/assets/img/number/1.png';
import number2 from '@/assets/img/number/2.png';
import number3 from '@/assets/img/number/3.png';
import number4 from '@/assets/img/number/4.png';
import number5 from '@/assets/img/number/5.png';
import number6 from '@/assets/img/number/6.png';
import number7 from '@/assets/img/number/7.png';
import number8 from '@/assets/img/number/8.png';
import number9 from '@/assets/img/number/9.png';

const useUserInfo = () => {
    const [user, setUser] = React.useState<{ email: string; nickname: string; profile?: string } | null>(null);
    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserInfo();
                if (data.success) {
                    setUser(data);
                }
            } catch (e) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);
    return user;
};

const useUserBalance = () => {
    const [balance, setBalance] = React.useState<{ point: number; cash: number } | null>(null);
    React.useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await getUserBalance();
                if (data.success) {
                    setBalance(data);
                }
            } catch (e) {
                setBalance(null);
            }
        };
        fetchBalance();
    }, []);
    return balance;
};

const userBoxNoise = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <filter id="noiseU"><feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#noiseU)" opacity="0.08"/>
  </svg>
`);

const UserBoxShadow = styled.div`
    position: absolute;
    top: -4px;
    left: 0;
    width: 40%;
    height: 3.6rem;
    background: rgba(0, 0, 0, 0.08);
    clip-path: polygon(0 0, 100% 0%, 92% 75%, 87% 92%, 80% 99%, 70% 100%, 0% 100%);
    border-bottom-right-radius: 1.2rem;
    z-index: 2;
    transform: translateY(4px);
`;

const UserBox = styled.div`
    display: flex;
    align-items: center;
    background-color: rgb(241 234 170);
    background-image: linear-gradient(120deg, #ffe066 80%, #ffd700 100%), url('data:image/svg+xml;utf8,${userBoxNoise}');
    background-blend-mode: overlay, normal;
    clip-path: polygon(0 0, 100% 0%, 92% 75%, 87% 92%, 80% 99%, 70% 100%, 0% 100%);
    border-bottom-right-radius: 1.2rem;
    height: 3.5rem;
    width: 52%;
    z-index: 3;
    position: relative;
`;

const Nickname = styled.span`
    font-family: 'Cafe24Ssurround', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #222;
    margin-left: 0.75rem;
    max-width: 7.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const topBarNoise = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <filter id="noiseT"><feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#noiseT)" opacity="0.04"/>
  </svg>
`);

const TopBar = styled.div`
    display: flex;
    height: 2.8rem;
    margin-left: -2.5rem;
    background-color: rgb(251, 244, 202);
    background-image: linear-gradient(90deg, rgb(255, 235, 104) 80%, rgb(255, 245, 136) 100%),
        url('data:image/svg+xml;utf8,${topBarNoise}');
    background-blend-mode: overlay, normal;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
    overflow: visible;
    position: relative;
`;

const TopBarShadow = styled.div`
    position: absolute;
    top: -4px;
    width: 100%;
    height: 3.1rem;
    background: rgba(0, 0, 0, 0.08);
    z-index: 0;
    transform: translateY(4px);
    display: flex;
    justify-content: flex-end;
`;

const AssetBox = styled.div`
    display: flex;
    align-items: center;
    min-width: 7.5rem;
    position: relative;
`;

const ProfileImg = styled.img`
    width: 3.5rem;
    height: 3.5rem;
    object-fit: cover;
    background: #eee;
    border: 1.5px solid #e0e0e0;
`;

const InfoBox = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const InfoBoxWithMargin = styled(InfoBox)`
    margin-right: 0.3rem;
`;

const NumberWrapper = styled.div`
    border-radius: 1rem;
    padding: 0.15rem 0rem 0.15rem 0.8rem;
    margin-left: -0.7rem;
    min-width: 2.8rem;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const Icon = styled.img`
    width: 1.75rem;
    height: 1.75rem;
    position: relative;
    z-index: 1;
`;

const SettingBtn = styled.button`
    background: none;
    cursor: pointer;
    padding: 0.3rem;
    height: 2.8rem;
    display: flex;
    align-items: center;
`;

const numberImages: Record<string, string> = {
    '0': number0,
    '1': number1,
    '2': number2,
    '3': number3,
    '4': number4,
    '5': number5,
    '6': number6,
    '7': number7,
    '8': number8,
    '9': number9,
};

const NumberImage: React.FC<{ value: number | string; height?: string }> = ({ value, height = '1.6rem' }) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
        {String(value)
            .split('')
            .map((digit, idx) =>
                numberImages[digit] ? (
                    <img
                        key={idx}
                        src={numberImages[digit]}
                        alt={digit}
                        style={{ height, marginRight: idx === String(value).length - 1 ? 0 : 0.5, marginTop: 1 }}
                    />
                ) : null,
            )}
    </span>
);

const HeaderContainer = styled.header`
    width: 100%;
    height: 3.6rem;
    display: flex;
    align-items: flex-start;
    position: relative;
    z-index: 101;
    flex-direction: row;
`;

const Header: React.FC = () => {
    const user = useUserInfo();
    const balance = useUserBalance();
    const navigate = useNavigate();
    const profileSrc = user?.profile ? user.profile : defaultProfileImg;

    return (
        <HeaderContainer>
            <UserBoxShadow />
            <UserBox>
                <ProfileImg
                    src={profileSrc}
                    alt='프로필'
                />
                <Nickname>{user?.nickname ?? '-'}</Nickname>
            </UserBox>
            <TopBarShadow />
            <TopBar>
                <AssetBox>
                    <InfoBoxWithMargin>
                        <Icon
                            src={pointImg}
                            alt='포인트'
                        />
                        <NumberWrapper>
                            <NumberImage
                                value={balance?.point ?? 0}
                                height='0.75rem'
                            />
                        </NumberWrapper>
                    </InfoBoxWithMargin>
                    <InfoBox>
                        <Icon
                            src={cashImg}
                            alt='캐시'
                        />
                        <NumberWrapper>
                            <NumberImage
                                value={balance?.cash ?? 0}
                                height='0.75rem'
                            />
                        </NumberWrapper>
                    </InfoBox>
                </AssetBox>
                <SettingBtn onClick={() => navigate('/settings')}>
                    <img
                        src={settingImg}
                        alt='설정'
                        style={{ width: '1.75rem', height: '1.75rem' }}
                    />
                </SettingBtn>
            </TopBar>
        </HeaderContainer>
    );
};

export default Header;
