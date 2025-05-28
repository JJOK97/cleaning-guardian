import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ProcessedStageInfo } from '@/types/map';
import { PollutionData } from '@/api/stages';
import { UserSkinData } from '@/api/skins';
import { GameItem, getUserItems, useItem, getEquippedItems, getStageConfig, getGameItemEffects } from '@/api/game';
import { UserItem } from '@/types/inventory';
import { pollutionNameToFile } from '@/utils/assetMapping';
import { useAuth } from '@/hooks/useAuth';

/**
 * 스테이지 정보 모달 컴포넌트
 *
 * 게임 로직 개선 관련 기능:
 * 1. 오염물질 정보 표시 - DB 데이터 기반으로 실제 오염물질 정보 표시
 * 2. 장착된 아이템 표시 - 게임 내 효과가 적용될 아이템들 확인
 * 3. 스킨 정보 표시 - 게임 플레이에 영향을 주는 스킨 정보
 *
 * TODO: 게임 로직 개선 후 추가 기능
 * - 스테이지별 게임 설정 정보 표시 (제한시간, 생명력 등)
 * - 아이템 효과 미리보기
 * - 예상 점수 배율 표시
 */

interface StageInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    stageInfo: ProcessedStageInfo;
    pollutions: PollutionData[]; // DB에서 가져온 실제 오염물질 데이터 배열
    equippedSkins: {
        slice: UserSkinData | null;
        tap: UserSkinData | null;
    };
    onChangeSkin: () => void;
    onStartGame: () => void;
}

// 스테이지별 테마 색상
const getStageTheme = (stageIdx: number) => {
    switch (stageIdx) {
        case 1: // 늪지 - 초록색 테마
            return {
                primary: '#2E7D32',
                secondary: '#4CAF50',
                accent: '#81C784',
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
                border: '#4CAF50',
                glow: 'rgba(76, 175, 80, 0.5)',
                text: '#E8F5E9',
                sectionBg: 'rgba(46, 125, 50, 0.3)',
            };
        case 2: // 토양 - 갈색 테마
            return {
                primary: '#5D4037',
                secondary: '#8D6E63',
                accent: '#BCAAA4',
                background: 'linear-gradient(135deg, #3E2723 0%, #5D4037 50%, #6D4C41 100%)',
                border: '#8D6E63',
                glow: 'rgba(141, 110, 99, 0.5)',
                text: '#EFEBE9',
                sectionBg: 'rgba(93, 64, 55, 0.3)',
            };
        case 3: // 대기오염 - 어두운 회색 테마
            return {
                primary: '#37474F',
                secondary: '#607D8B',
                accent: '#90A4AE',
                background: 'linear-gradient(135deg, #263238 0%, #37474F 50%, #455A64 100%)',
                border: '#607D8B',
                glow: 'rgba(96, 125, 139, 0.5)',
                text: '#ECEFF1',
                sectionBg: 'rgba(55, 71, 79, 0.3)',
            };
        default:
            return {
                primary: '#2E7D32',
                secondary: '#4CAF50',
                accent: '#81C784',
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
                border: '#4CAF50',
                glow: 'rgba(76, 175, 80, 0.5)',
                text: '#E8F5E9',
                sectionBg: 'rgba(46, 125, 50, 0.3)',
            };
    }
};

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
`;

const fadeOut = keyframes`
    from {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
    to {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
    }
`;

const glow = keyframes`
    0% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
    50% {
        box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
    }
    100% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
`;

const ModalOverlay = styled.div<{ $isClosing: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const ModalContent = styled.div<{ $isClosing: boolean; $theme: ReturnType<typeof getStageTheme> }>`
    background: ${({ $theme }) => $theme.background};
    border: 3px solid ${({ $theme }) => $theme.border};
    border-radius: 20px;
    width: clamp(320px, 90vw, 600px);
    max-height: 90vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 60px ${({ $theme }) => $theme.glow}, inset 0 0 30px rgba(0, 0, 0, 0.5),
        0 20px 60px rgba(0, 0, 0, 0.5);
    animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards,
        ${glow} 3s ease-in-out infinite;

    @media (max-width: 768px) {
        width: 95vw;
        max-height: 80vh;
        border-radius: 16px;
        margin: 2rem 0;
    }
`;

const CloseButton = styled.button<{ $theme: ReturnType<typeof getStageTheme> }>`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: ${({ $theme }) => $theme.sectionBg};
    border: 2px solid ${({ $theme }) => $theme.border};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: ${({ $theme }) => $theme.text};
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;

    &:hover {
        transform: scale(1.1) rotate(90deg);
        background: ${({ $theme }) => $theme.secondary};
        box-shadow: 0 0 20px ${({ $theme }) => $theme.glow};
    }

    @media (max-width: 768px) {
        width: 36px;
        height: 36px;
        font-size: 1.3rem;
        top: 0.8rem;
        right: 0.8rem;
    }
`;

const Header = styled.div<{ $theme: ReturnType<typeof getStageTheme> }>`
    background: ${({ $theme }) => $theme.sectionBg};
    border-bottom: 2px solid ${({ $theme }) => $theme.border};
    padding: 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, ${({ $theme }) => $theme.glow} 0%, transparent 70%);
        opacity: 0.3;
        animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        padding: 0.8rem 0.5rem;
    }
`;

const Title = styled.h2<{ $theme: ReturnType<typeof getStageTheme> }>`
    font-size: 2rem;
    color: ${({ $theme }) => $theme.text};
    margin: 0;
    font-weight: 800;
    text-shadow: 0 0 20px ${({ $theme }) => $theme.glow}, 0 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
        font-size: 1.2rem;
        letter-spacing: 0.3px;
    }
`;

const ContentSection = styled.div<{ $theme: ReturnType<typeof getStageTheme> }>`
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ $theme }) => $theme.secondary};
        border-radius: 4px;

        &:hover {
            background: ${({ $theme }) => $theme.accent};
        }
    }

    @media (max-width: 768px) {
        padding: 0.5rem;
        gap: 0.5rem;
        overflow-y: hidden;

        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const Section = styled.div<{ $theme: ReturnType<typeof getStageTheme> }>`
    background: ${({ $theme }) => $theme.sectionBg};
    border: 2px solid ${({ $theme }) => $theme.border};
    border-radius: 15px;
    padding: 1.2rem;
    backdrop-filter: blur(10px);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: visible;

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, ${({ $theme }) => $theme.glow}, transparent, ${({ $theme }) => $theme.glow});
        border-radius: 15px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    &:hover::before {
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        padding: 0.5rem;
        border-radius: 8px;
    }
`;

const SectionTitle = styled.h3<{ $theme: ReturnType<typeof getStageTheme> }>`
    font-size: 1.3rem;
    color: ${({ $theme }) => $theme.accent};
    margin: 0 0 1rem 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-shadow: 0 0 10px ${({ $theme }) => $theme.glow};
    text-transform: uppercase;
    letter-spacing: 1px;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-bottom: 0.4rem;
        letter-spacing: 0.2px;
        gap: 0.2rem;
    }
`;

const MissionText = styled.p<{ $theme: ReturnType<typeof getStageTheme> }>`
    color: ${({ $theme }) => $theme.text};
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 0.75rem;
        line-height: 1.3;
    }
`;

const PollutionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
    padding-bottom: 0.5rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 0.4rem;
        padding-bottom: 0;
    }
`;

const PollutionItem = styled.div<{ $theme: ReturnType<typeof getStageTheme> }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0.6rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid ${({ $theme }) => $theme.border};
    border-radius: 10px;
    transition: all 0.3s ease;
    aspect-ratio: 1;
    min-width: 0;
    position: relative;

    &:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        border-color: ${({ $theme }) => $theme.accent};
        z-index: 1;
    }

    @media (max-width: 768px) {
        padding: 0.3rem;
        border-radius: 6px;
    }
`;

const PollutionImage = styled.img`
    width: 100%;
    height: auto;
    max-width: 40px;
    max-height: 40px;
    object-fit: contain;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
    margin-bottom: 0.3rem;

    @media (max-width: 768px) {
        max-width: 25px;
        max-height: 25px;
    }
`;

const PollutionName = styled.span<{ $theme: ReturnType<typeof getStageTheme> }>`
    color: ${({ $theme }) => $theme.text};
    font-size: 0.65rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.1;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;

    @media (max-width: 768px) {
        font-size: 0.55rem;
    }
`;

const ItemGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
    padding-bottom: 0.5rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 0.4rem;
        padding-bottom: 0;
    }
`;

const ItemCard = styled.div<{ $theme: ReturnType<typeof getStageTheme> }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 0.3rem;
    padding: 0.6rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid ${({ $theme }) => $theme.border};
    border-radius: 10px;
    transition: all 0.3s ease;
    aspect-ratio: 1;
    min-width: 0;
    position: relative;

    &:hover {
        transform: translateY(-3px) scale(1.05);
        border-color: ${({ $theme }) => $theme.accent};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1;
    }

    @media (max-width: 768px) {
        padding: 0.3rem;
        border-radius: 6px;
        gap: 0.15rem;
    }
`;

const ItemImage = styled.img`
    width: 100%;
    height: auto;
    max-width: 40px;
    max-height: 40px;
    object-fit: contain;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));

    @media (max-width: 768px) {
        max-width: 25px;
        max-height: 25px;
    }
`;

const ItemName = styled.span<{ $theme: ReturnType<typeof getStageTheme> }>`
    color: ${({ $theme }) => $theme.text};
    font-size: 0.65rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.1;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;

    @media (max-width: 768px) {
        font-size: 0.55rem;
    }
`;

const SkinCard = styled(ItemCard)``;

const SkinImage = styled(ItemImage)`
    max-width: 45px;
    max-height: 45px;

    @media (max-width: 768px) {
        max-width: 28px;
        max-height: 28px;
    }
`;

const StartButton = styled.button<{ $theme: ReturnType<typeof getStageTheme> }>`
    width: 100%;
    padding: 1.5rem;
    border: none;
    border-radius: 0 0 17px 17px;
    font-size: 1.3rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, ${({ $theme }) => $theme.secondary} 0%, ${({ $theme }) => $theme.primary} 100%);
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

        &::before {
            left: 100%;
        }
    }

    &:active {
        transform: scale(0.98);
    }

    @media (max-width: 768px) {
        padding: 0.7rem;
        font-size: 0.85rem;
        letter-spacing: 0.3px;
        border-radius: 0 0 13px 13px;
    }
`;

const StageInfoModal: React.FC<StageInfoModalProps> = ({
    isOpen,
    onClose,
    stageInfo,
    pollutions,
    equippedSkins,
    onChangeSkin,
    onStartGame,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [equippedItems, setEquippedItems] = useState<UserItem[]>([]);
    const { user } = useAuth();

    // 스테이지 인덱스 추출 (stageIdx가 없으면 stageName에서 추출)
    const getStageIndex = () => {
        if (stageInfo.stageIdx) {
            // stageIdx로부터 mapIdx 계산
            // 스테이지 1-3: 맵 1
            // 스테이지 4-6: 맵 2
            // 스테이지 7-9: 맵 3
            return Math.ceil(stageInfo.stageIdx / 3);
        }
        const match = stageInfo.stageName.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    };

    const theme = getStageTheme(getStageIndex());

    useEffect(() => {
        const fetchEquippedItems = async () => {
            if (!user?.email) return;
            try {
                const response = await getEquippedItems(user.email);
                if (response && typeof response === 'object' && 'items' in response) {
                    setEquippedItems((response as any).items);
                }
            } catch (error) {
                console.error('장착된 아이템 조회 에러:', error);
            }
        };

        if (isOpen) {
            fetchEquippedItems();
        }
    }, [isOpen, user?.email]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250);
    };

    return (
        <ModalOverlay
            onClick={handleClose}
            $isClosing={isClosing}
        >
            <ModalContent
                onClick={(e) => e.stopPropagation()}
                $isClosing={isClosing}
                $theme={theme}
            >
                <CloseButton
                    onClick={handleClose}
                    $theme={theme}
                >
                    ×
                </CloseButton>

                <Header $theme={theme}>
                    <Title $theme={theme}>{stageInfo.stageName}</Title>
                </Header>

                <ContentSection $theme={theme}>
                    <Section $theme={theme}>
                        <SectionTitle $theme={theme}>미션</SectionTitle>
                        <MissionText $theme={theme}>{stageInfo.stageMission.mission}</MissionText>
                    </Section>

                    <Section $theme={theme}>
                        <SectionTitle $theme={theme}>오염물질</SectionTitle>
                        <PollutionGrid>
                            {pollutions.map((pollution) => (
                                <PollutionItem
                                    key={pollution.polIdx}
                                    $theme={theme}
                                >
                                    <PollutionImage
                                        src={`/assets/img/pollution/${pollution.polImg1}`}
                                        alt={pollution.polName}
                                        onError={(e) => {
                                            e.currentTarget.src = '/assets/img/pollution/pet.png';
                                        }}
                                    />
                                    <PollutionName $theme={theme}>{pollution.polName}</PollutionName>
                                </PollutionItem>
                            ))}
                        </PollutionGrid>
                    </Section>

                    {equippedItems.length > 0 && (
                        <Section $theme={theme}>
                            <SectionTitle $theme={theme}>장착 아이템</SectionTitle>
                            <ItemGrid>
                                {equippedItems.map((item) => (
                                    <ItemCard
                                        key={item.userItemIdx}
                                        $theme={theme}
                                    >
                                        <ItemImage
                                            src={`/assets/img/items/${item.item.itemImg}.png`}
                                            alt={item.item.itemName}
                                        />
                                        <ItemName $theme={theme}>{item.item.itemName}</ItemName>
                                    </ItemCard>
                                ))}
                            </ItemGrid>
                        </Section>
                    )}

                    {(equippedSkins.slice || (stageInfo.isFinalStage === 'Y' && equippedSkins.tap)) && (
                        <Section $theme={theme}>
                            <SectionTitle $theme={theme}>장착 스킨</SectionTitle>
                            <ItemGrid>
                                {equippedSkins.slice && (
                                    <SkinCard $theme={theme}>
                                        <SkinImage
                                            src={`/assets/img/skins/${equippedSkins.slice.skin.skinImg}`}
                                            alt={equippedSkins.slice.skin.skinName || '슬라이스 스킨'}
                                        />
                                        <ItemName $theme={theme}>
                                            {equippedSkins.slice.skin.skinName || '기본 슬라이스 스킨'}
                                        </ItemName>
                                    </SkinCard>
                                )}
                                {stageInfo.isFinalStage === 'Y' && equippedSkins.tap && (
                                    <SkinCard $theme={theme}>
                                        <SkinImage
                                            src={`/assets/img/skins/${equippedSkins.tap.skin.skinImg}`}
                                            alt={equippedSkins.tap.skin.skinName || '탭 스킨'}
                                        />
                                        <ItemName $theme={theme}>
                                            {equippedSkins.tap.skin.skinName || '기본 탭 스킨'}
                                        </ItemName>
                                    </SkinCard>
                                )}
                            </ItemGrid>
                        </Section>
                    )}
                </ContentSection>

                <StartButton
                    $theme={theme}
                    onClick={onStartGame}
                >
                    🎮 게임 시작
                </StartButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default StageInfoModal;
