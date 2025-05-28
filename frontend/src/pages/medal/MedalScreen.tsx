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
    totalDefeated: number;
    totalScore: number;
    maxCombo: number;
    maxScore: number;
    createdAt: string;
    updatedAt: string;
    pollutionName?: string;
    pollutionImage?: string;
    pollutionType?: string;
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

const slideAnimation = keyframes`
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    10% {
        transform: translateX(0);
        opacity: 1;
    }
    90% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
`;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    padding: 1rem;
    padding-bottom: 5rem; /* Footer 공간 확보 */
    animation: ${fadeIn} 0.6s ease-out;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* 스크롤 방지 */
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
`;

const Title = styled.h1`
    color: #fff;
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    margin: 0;
`;

const SummaryCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
`;

const SummaryTitle = styled.h2`
    color: #fff;
    font-size: 1.4rem;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
`;

const SummaryStats = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
`;

const SummaryStatItem = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
`;

const SummaryStatValue = styled.div`
    color: #4caf50;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
`;

const SummaryStatLabel = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
`;

const InsightBannerContainer = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
    height: 200px;
    flex-shrink: 0;
`;

const InsightBannerTitle = styled.h3`
    color: #fff;
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
`;

const InsightSlide = styled.div<{ $isActive: boolean }>`
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    opacity: ${(props) => (props.$isActive ? 1 : 0)};
    transform: ${(props) => (props.$isActive ? 'translateX(0)' : 'translateX(100%)')};
    transition: all 0.5s ease-in-out;
`;

const InsightUserName = styled.div`
    color: #4caf50;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
`;

const InsightContent = styled.div`
    color: #fff;
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
`;

const InsightHighlight = styled.span`
    color: #4caf50;
    font-weight: bold;
`;

const CollectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    flex: 1;
    overflow-y: auto;
    max-height: 300px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
    }
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
    width: 50px;
    height: 50px;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    margin-bottom: 0.5rem;
    padding: 0.3rem;
`;

const PollutionName = styled.h4`
    color: #fff;
    font-size: 0.8rem;
    margin: 0 0 0.5rem 0;
`;

const CollectionStats = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

const CollectionStat = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
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
    const [collectionStats, setCollectionStats] = useState<UserCollectionStats[]>([]);
    const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

    // ===== API 호출 함수들 =====

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

    // ===== 데이터 로딩 =====
    useEffect(() => {
        const loadData = async () => {
            if (!user?.email) return;

            setLoading(true);
            setError(null);

            try {
                await fetchCollectionStats(user.email);
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

    // ===== 인사이트 슬라이드 자동 전환 =====
    useEffect(() => {
        const insights = generateEnvironmentalInsights();
        if (insights.length > 0) {
            const interval = setInterval(() => {
                setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
            }, 4000); // 4초마다 전환

            return () => clearInterval(interval);
        }
    }, [collectionStats]);

    // ===== 유틸리티 함수들 =====

    /**
     * 숫자를 천 단위로 포맷
     */
    const formatNumber = (num: number | undefined | null): string => {
        if (num === undefined || num === null || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString();
    };

    /**
     * 총계 계산
     */
    const calculateTotals = () => {
        const totalDefeated = collectionStats.reduce((sum, stat) => sum + stat.totalDefeated, 0);
        const totalScore = collectionStats.reduce((sum, stat) => sum + stat.totalScore, 0);
        const maxCombo = Math.max(...collectionStats.map((stat) => stat.maxCombo), 0);
        const uniqueTypes = new Set(collectionStats.map((stat) => stat.pollutionType)).size;

        return { totalDefeated, totalScore, maxCombo, uniqueTypes };
    };

    /**
     * 환경 영향 인사이트 생성
     */
    const generateEnvironmentalInsights = () => {
        if (!user?.nickname || collectionStats.length === 0) return [];

        const totals = calculateTotals();
        const waterPollutants = collectionStats.filter((stat) => stat.pollutionType === 'W');
        const landPollutants = collectionStats.filter((stat) => stat.pollutionType === 'L');
        const airPollutants = collectionStats.filter((stat) => stat.pollutionType === 'A');

        const waterDefeated = waterPollutants.reduce((sum, stat) => sum + stat.totalDefeated, 0);
        const landDefeated = landPollutants.reduce((sum, stat) => sum + stat.totalDefeated, 0);
        const airDefeated = airPollutants.reduce((sum, stat) => sum + stat.totalDefeated, 0);

        const insights = [];

        // 물 오염물질 인사이트
        if (waterDefeated > 0) {
            const cleanWater = Math.round(waterDefeated * 0.5); // 1개당 0.5L 가정
            const childrenDays = Math.round(cleanWater / 2); // 어린이 하루 2L
            const adultDays = Math.round(cleanWater / 2.5); // 어른 하루 2.5L

            insights.push({
                type: 'water',
                content: `${user.nickname}님은 되찾은 깨끗한 수분량 ${cleanWater}L로 어린이 ${childrenDays}명 또는 어른 ${adultDays}명이 하루 마실 수 있는 물을 정화했어요!`,
            });
        }

        // 토양 오염물질 인사이트
        if (landDefeated > 0) {
            const cleanSoil = Math.round(landDefeated * 2); // 1개당 2L 가정
            const trees = Math.round(cleanSoil / 100); // 나무 1그루당 100L
            const rice = Math.round(cleanSoil / 50); // 쌀 1kg당 50L

            insights.push({
                type: 'land',
                content: `${user.nickname}님은 되찾은 깨끗한 토사량 ${cleanSoil}L로 나무 ${trees}그루 또는 쌀 ${rice}kg을 키워낼 만큼의 깨끗한 흙을 만들었어요!`,
            });
        }

        // 대기 오염물질 인사이트
        if (airDefeated > 0) {
            const cleanAir = Math.round(airDefeated * 0.8); // 1개당 0.8㎥ 가정
            const adultBreath = Math.round(cleanAir / 20); // 어른 하루 20㎥
            const childBreath = Math.round(cleanAir / 10); // 어린이 하루 10㎥

            insights.push({
                type: 'air',
                content: `${user.nickname}님은 되찾은 깨끗한 공기량 ${cleanAir}㎥로 어른 ${adultBreath}명 또는 어린이 ${childBreath}명이 하루 숨쉴 수 있는 공기를 정화했어요!`,
            });
        }

        // 전체 환경 영향 인사이트
        if (totals.totalDefeated > 100) {
            const co2Reduction = Math.round(totals.totalDefeated * 0.1); // 1개당 0.1kg CO2 감소
            const treeEquivalent = Math.round(co2Reduction / 22); // 나무 1그루당 연간 22kg CO2 흡수

            insights.push({
                type: 'environment',
                content: `${user.nickname}님의 노력으로 약 ${co2Reduction}kg의 CO2 배출을 줄였어요! 이는 나무 ${treeEquivalent}그루가 1년간 흡수하는 양과 같습니다!`,
            });
        }

        return insights;
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

    const totals = calculateTotals();
    const insights = generateEnvironmentalInsights();

    return (
        <TransitionWrapper $isVisible={true}>
            <Container>
                <Header>
                    <Title>🏆 환경 수호 성과</Title>
                    <Subtitle>당신의 환경 보호 활동이 지구에 미친 긍정적 영향을 확인하세요</Subtitle>
                </Header>

                {/* 총계 요약 */}
                <SummaryCard>
                    <SummaryTitle>🌍 전체 성과 요약</SummaryTitle>
                    <SummaryStats>
                        <SummaryStatItem>
                            <SummaryStatValue>{formatNumber(totals.totalDefeated)}</SummaryStatValue>
                            <SummaryStatLabel>총 처치 횟수</SummaryStatLabel>
                        </SummaryStatItem>
                        <SummaryStatItem>
                            <SummaryStatValue>{formatNumber(totals.totalScore)}</SummaryStatValue>
                            <SummaryStatLabel>총 획득 점수</SummaryStatLabel>
                        </SummaryStatItem>
                        <SummaryStatItem>
                            <SummaryStatValue>{totals.maxCombo}</SummaryStatValue>
                            <SummaryStatLabel>최고 콤보</SummaryStatLabel>
                        </SummaryStatItem>
                        <SummaryStatItem>
                            <SummaryStatValue>{totals.uniqueTypes}</SummaryStatValue>
                            <SummaryStatLabel>정화 영역</SummaryStatLabel>
                        </SummaryStatItem>
                    </SummaryStats>
                </SummaryCard>

                {/* 환경 영향 인사이트 배너 */}
                {insights.length > 0 && (
                    <InsightBannerContainer>
                        <InsightBannerTitle>🌱 환경 영향 인사이트</InsightBannerTitle>
                        {insights.map((insight, index) => (
                            <InsightSlide
                                key={index}
                                $isActive={index === currentInsightIndex}
                            >
                                <InsightUserName>{user.nickname}님의 환경 기여도</InsightUserName>
                                <InsightContent>
                                    {insight.content.split(user.nickname).map((part, i) => (
                                        <span key={i}>
                                            {i > 0 && <InsightHighlight>{user.nickname}</InsightHighlight>}
                                            {part}
                                        </span>
                                    ))}
                                </InsightContent>
                            </InsightSlide>
                        ))}
                    </InsightBannerContainer>
                )}

                {/* 수집 현황 */}
                {collectionStats.length > 0 ? (
                    <CollectionGrid>
                        {collectionStats.map((stat) => (
                            <CollectionItem key={stat.statsIdx}>
                                <PollutionImage
                                    src={`/assets/img/pollution/${stat.pollutionImage || 'default.png'}`}
                                    alt={stat.pollutionName || '오염물질'}
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/img/pollution/pet.png';
                                    }}
                                />
                                <PollutionName>{stat.pollutionName || `오염물질 ${stat.polIdx}`}</PollutionName>
                                <CollectionStats>
                                    <CollectionStat>
                                        <CollectionStatLabel>처치</CollectionStatLabel>
                                        <CollectionStatValue>{formatNumber(stat.totalDefeated)}개</CollectionStatValue>
                                    </CollectionStat>
                                    <CollectionStat>
                                        <CollectionStatLabel>점수</CollectionStatLabel>
                                        <CollectionStatValue>{formatNumber(stat.totalScore)}점</CollectionStatValue>
                                    </CollectionStat>
                                    <CollectionStat>
                                        <CollectionStatLabel>콤보</CollectionStatLabel>
                                        <CollectionStatValue>{stat.maxCombo}</CollectionStatValue>
                                    </CollectionStat>
                                </CollectionStats>
                            </CollectionItem>
                        ))}
                    </CollectionGrid>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                        }}
                    >
                        아직 수집한 오염물질이 없습니다.
                        <br />
                        게임을 플레이하여 환경을 보호해보세요!
                    </div>
                )}
            </Container>
        </TransitionWrapper>
    );
};

export default MedalScreen;
