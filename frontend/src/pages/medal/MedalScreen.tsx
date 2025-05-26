import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';
import TransitionWrapper from '@/components/common/TransitionWrapper';

// ===== 게임 로직 개선: 새로운 API 타입들 =====

/**
 * 사용자 수집 통계 정보
 */
interface UserCollectionStats {
    statsIdx: number;
    email: string;
    polIdx: number;
    defeatedCount: number;
    totalScore: number;
    maxCombo: number;
    maxScore: number;
    createdAt: string;
    updatedAt: string;
    pollution?: {
        polIdx: number;
        polName: string;
        polImg1: string;
        type: string;
    };
}

/**
 * 종합 통계 정보
 */
interface UserStatsSummary {
    email: string;
    totalDefeated: number;
    totalScore: number;
    maxCombo: number;
    averageScore: number;
}

/**
 * 아이템 효과 통계
 */
interface ItemEffectStats {
    effectType: string;
    totalEffect: number;
}

// ===== 스타일 컴포넌트들 =====

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    padding: 1rem;
    padding-bottom: 5rem; /* Footer 공간 확보 */
    animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
`;

const Title = styled.h1`
    color: #fff;
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin: 0;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatsCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
`;

const CardTitle = styled.h3`
    color: #fff;
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const StatItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

const StatLabel = styled.span`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
`;

const StatValue = styled.span`
    color: #4caf50;
    font-size: 1.1rem;
    font-weight: bold;
`;

const CollectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
`;

const CollectionItem = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem;
    text-align: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-3px);
    }
`;

const PollutionImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    margin-bottom: 0.5rem;
    padding: 0.3rem;
`;

const PollutionName = styled.h4`
    color: #fff;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
`;

const CollectionStats = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const CollectionStat = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
`;

const CollectionStatLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
`;

const CollectionStatValue = styled.span`
    color: #4caf50;
    font-weight: bold;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
`;

const ErrorMessage = styled.div`
    text-align: center;
    color: #ff6b6b;
    font-size: 1.1rem;
    padding: 2rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(255, 107, 107, 0.3);
`;

// ===== 메인 컴포넌트 =====

const MedalScreen: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ===== 게임 로직 개선: 새로운 상태들 =====
    const [userStats, setUserStats] = useState<UserStatsSummary | null>(null);
    const [collectionStats, setCollectionStats] = useState<UserCollectionStats[]>([]);
    const [itemEffects, setItemEffects] = useState<ItemEffectStats[]>([]);

    // ===== API 호출 함수들 =====

    /**
     * 사용자 종합 통계 조회
     */
    const fetchUserStatsSummary = async (email: string) => {
        try {
            const response = await fetch(`/api/v1/collection-stats/users/${email}/summary`);
            if (response.ok) {
                const data = await response.json();
                setUserStats(data);
            }
        } catch (error) {
            console.error('종합 통계 조회 실패:', error);
        }
    };

    /**
     * 사용자 수집 통계 조회
     */
    const fetchCollectionStats = async (email: string) => {
        try {
            const response = await fetch(`/api/v1/collection-stats/users/${email}`);
            if (response.ok) {
                const data = await response.json();
                setCollectionStats(data);
            }
        } catch (error) {
            console.error('수집 통계 조회 실패:', error);
        }
    };

    /**
     * 아이템 효과 정보 조회
     */
    const fetchItemEffects = async (email: string) => {
        try {
            const response = await fetch(`/api/v1/items/effects/game-start`, {
                headers: { email },
            });
            if (response.ok) {
                const data = await response.json();
                const effects = Object.entries(data).map(([effectType, totalEffect]) => ({
                    effectType,
                    totalEffect: totalEffect as number,
                }));
                setItemEffects(effects);
            }
        } catch (error) {
            console.error('아이템 효과 조회 실패:', error);
        }
    };

    // ===== 데이터 로딩 =====
    useEffect(() => {
        const loadData = async () => {
            if (!user?.email) return;

            setLoading(true);
            setError(null);

            try {
                await Promise.all([
                    fetchUserStatsSummary(user.email),
                    fetchCollectionStats(user.email),
                    fetchItemEffects(user.email),
                ]);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            loadData();
        }
    }, [user, authLoading]);

    // ===== 유틸리티 함수들 =====

    /**
     * 효과 타입을 한글로 변환
     */
    const getEffectTypeName = (effectType: string): string => {
        const typeMap: { [key: string]: string } = {
            SCORE_BOOST: '점수 부스트',
            TIME_EXTEND: '시간 연장',
            LIFE_BOOST: '생명력 부스트',
            COMBO_BOOST: '콤보 부스트',
            SLOW_TIME: '슬로우 타임',
        };
        return typeMap[effectType] || effectType;
    };

    /**
     * 숫자를 천 단위로 포맷
     */
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    // ===== 렌더링 =====

    if (authLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <Container>
                <ErrorMessage>로그인이 필요합니다.</ErrorMessage>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container>
                <LoadingContainer>
                    <LoadingScreen />
                </LoadingContainer>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage>{error}</ErrorMessage>
            </Container>
        );
    }

    return (
        <TransitionWrapper $isVisible={true}>
            <Container>
                <Header>
                    <Title>🏆 성과 및 통계</Title>
                    <Subtitle>당신의 게임 성과와 수집 현황을 확인하세요</Subtitle>
                </Header>

                <StatsGrid>
                    {/* 종합 통계 카드 */}
                    <StatsCard>
                        <CardTitle>📊 종합 통계</CardTitle>
                        {userStats ? (
                            <>
                                <StatItem>
                                    <StatLabel>총 처치 횟수</StatLabel>
                                    <StatValue>{formatNumber(userStats.totalDefeated)}개</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>총 획득 점수</StatLabel>
                                    <StatValue>{formatNumber(userStats.totalScore)}점</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>최고 콤보</StatLabel>
                                    <StatValue>{userStats.maxCombo}콤보</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>평균 점수</StatLabel>
                                    <StatValue>{formatNumber(Math.floor(userStats.averageScore))}점</StatValue>
                                </StatItem>
                            </>
                        ) : (
                            <StatItem>
                                <StatLabel>데이터 없음</StatLabel>
                                <StatValue>-</StatValue>
                            </StatItem>
                        )}
                    </StatsCard>

                    {/* 아이템 효과 카드 */}
                    <StatsCard>
                        <CardTitle>⚡ 현재 아이템 효과</CardTitle>
                        {itemEffects.length > 0 ? (
                            itemEffects.map((effect, index) => (
                                <StatItem key={index}>
                                    <StatLabel>{getEffectTypeName(effect.effectType)}</StatLabel>
                                    <StatValue>
                                        {effect.effectType.includes('BOOST')
                                            ? `${(effect.totalEffect * 100).toFixed(0)}%`
                                            : `+${effect.totalEffect}`}
                                    </StatValue>
                                </StatItem>
                            ))
                        ) : (
                            <StatItem>
                                <StatLabel>장착된 아이템 없음</StatLabel>
                                <StatValue>-</StatValue>
                            </StatItem>
                        )}
                    </StatsCard>

                    {/* 수집 현황 카드 */}
                    <StatsCard style={{ gridColumn: '1 / -1' }}>
                        <CardTitle>🗂️ 오염물질 수집 현황</CardTitle>
                        {collectionStats.length > 0 ? (
                            <CollectionGrid>
                                {collectionStats.map((stat) => (
                                    <CollectionItem key={stat.statsIdx}>
                                        <PollutionImage
                                            src={`/assets/img/pollution/${stat.pollution?.polImg1 || 'default.png'}`}
                                            alt={stat.pollution?.polName || '오염물질'}
                                            onError={(e) => {
                                                e.currentTarget.src = '/assets/img/pollution/pet.png';
                                            }}
                                        />
                                        <PollutionName>
                                            {stat.pollution?.polName || `오염물질 ${stat.polIdx}`}
                                        </PollutionName>
                                        <CollectionStats>
                                            <CollectionStat>
                                                <CollectionStatLabel>처치 횟수</CollectionStatLabel>
                                                <CollectionStatValue>
                                                    {formatNumber(stat.defeatedCount)}개
                                                </CollectionStatValue>
                                            </CollectionStat>
                                            <CollectionStat>
                                                <CollectionStatLabel>총 점수</CollectionStatLabel>
                                                <CollectionStatValue>
                                                    {formatNumber(stat.totalScore)}점
                                                </CollectionStatValue>
                                            </CollectionStat>
                                            <CollectionStat>
                                                <CollectionStatLabel>최고 콤보</CollectionStatLabel>
                                                <CollectionStatValue>{stat.maxCombo}콤보</CollectionStatValue>
                                            </CollectionStat>
                                            <CollectionStat>
                                                <CollectionStatLabel>최고 점수</CollectionStatLabel>
                                                <CollectionStatValue>
                                                    {formatNumber(stat.maxScore)}점
                                                </CollectionStatValue>
                                            </CollectionStat>
                                        </CollectionStats>
                                    </CollectionItem>
                                ))}
                            </CollectionGrid>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '2rem' }}>
                                아직 수집한 오염물질이 없습니다.
                                <br />
                                게임을 플레이하여 오염물질을 처치해보세요!
                            </div>
                        )}
                    </StatsCard>
                </StatsGrid>
            </Container>
        </TransitionWrapper>
    );
};

export default MedalScreen;
