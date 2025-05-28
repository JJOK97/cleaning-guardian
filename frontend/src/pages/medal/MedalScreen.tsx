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

const slideInFromRight = keyframes`
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    8% {
        transform: translateX(0);
        opacity: 1;
    }
    85% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
`;

const shimmer = keyframes`
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
`;

const Container = styled.div`
    min-height: 100vh;
    max-height: 100vh;
    background: linear-gradient(135deg, #8bc34a 0%, #9ccc65 50%, #aed581 100%);
    padding: 1rem;
    padding-bottom: 5rem;
    animation: ${fadeIn} 0.6s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    position: relative;
    margin-top: 1rem;
    justify-content: center;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        pointer-events: none;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    width: 100%;
    max-width: 600px;
`;

const Title = styled.h1`
    color: #fff;
    font-size: 1.6rem;
    margin: 0 0 0.3rem 0;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
    color: rgb(42, 112, 46);
    font-size: 0.8rem;
    margin: 0;
    line-height: 1.4;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    width: 100%;
    max-width: 600px;
`;

const SummaryCard = styled.div`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 1rem;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    flex-shrink: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.h2`
    color: #fff;
    font-size: 1.1rem;
    margin: 0 0 0.8rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SummaryStats = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 0.5rem;

    @media (max-width: 480px) {
        gap: 0.8rem;
    }
`;

const SummaryStatItem = styled.div`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 1rem;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const SummaryStatValue = styled.div`
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SummaryStatLabel = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    line-height: 1.2;
    font-weight: 500;
    color: rgb(42, 112, 46);
`;

const InsightBannerContainer = styled.div`
    background: linear-gradient(135deg, #689f38 0%, #7cb342 50%, #8bc34a 100%);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(139, 195, 74, 0.4);
    position: relative;
    overflow: hidden;
    min-height: 140px;
    height: auto;
    flex-shrink: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -200px;
        width: 200px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: ${shimmer} 3s infinite;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #7cb342, #8bc34a, #7cb342);
        border-radius: 20px 20px 0 0;
    }
`;

const InsightBannerTitle = styled.h3`
    color: #fff;
    font-size: 1rem;
    margin: 0 0 0.8rem 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    font-weight: bold;
`;

const InsightSlide = styled.div<{ $isActive: boolean }>`
    position: absolute;
    top: 45px;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    opacity: ${(props) => (props.$isActive ? 1 : 0)};
    transform: ${(props) => (props.$isActive ? 'translateX(0)' : 'translateX(100%)')};
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${(props) => (props.$isActive ? slideInFromRight : 'none')} 16s ease-in-out;
    min-height: 80px;
    padding: 0.5rem 0;
`;

const InsightUserName = styled.div`
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const InsightContent = styled.div`
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
    line-height: 1.5;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    word-break: keep-all;
    overflow-wrap: break-word;
    padding: 0 0.5rem;
`;

const InsightHighlight = styled.span`
    color: rgb(109, 255, 117);
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
            }, 10000); // 10초마다 전환

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

            insights.push({
                type: 'water',
                content: `${user.nickname}님은 되찾은 깨끗한 수분량 <highlight>${cleanWater}L</highlight>로 어린이 <highlight>${childrenDays}명</highlight>이 하루 마실 수 있는 물을 정화했어요!`,
            });
        }

        // 토양 오염물질 인사이트
        if (landDefeated > 0) {
            const cleanSoil = Math.round(landDefeated * 2); // 1개당 2L 가정
            const trees = Math.round(cleanSoil / 100); // 나무 1그루당 100L

            insights.push({
                type: 'land',
                content: `${user.nickname}님은 되찾은 깨끗한 토사량 <highlight>${cleanSoil}L</highlight>로 나무 <highlight>${trees}그루</highlight>를 키워낼 만큼의 깨끗한 흙을 만들었어요!`,
            });
        }

        // 대기 오염물질 인사이트
        if (airDefeated > 0) {
            const cleanAir = Math.round(airDefeated * 0.8); // 1개당 0.8㎥ 가정
            const childBreath = Math.round(cleanAir / 10); // 어린이 하루 10㎥

            insights.push({
                type: 'air',
                content: `${user.nickname}님은 되찾은 깨끗한 공기량 <highlight>${cleanAir}㎥</highlight>로 어린이 <highlight>${childBreath}명</highlight>이 하루 숨쉴 수 있는 공기를 정화했어요!`,
            });
        }

        // 전체 환경 영향 인사이트
        if (totals.totalDefeated > 100) {
            const co2Reduction = Math.round(totals.totalDefeated * 0.1); // 1개당 0.1kg CO2 감소
            const treeEquivalent = Math.round(co2Reduction / 22); // 나무 1그루당 연간 22kg CO2 흡수

            insights.push({
                type: 'environment',
                content: `${user.nickname}님의 노력으로 약 <highlight>${co2Reduction}kg</highlight>의 CO2 배출을 줄였어요! 이는 나무 <highlight>${treeEquivalent}그루</highlight>가 1년간 흡수하는 양과 같습니다!`,
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
                    <Title>환경 수호 성과</Title>
                    <Subtitle>실제였다면 어땠을까요?</Subtitle>
                </Header>

                <ContentWrapper>
                    {/* 총계 요약 */}
                    <SummaryCard>
                        <SummaryTitle>전체 성과 요약</SummaryTitle>
                        <SummaryStats>
                            <SummaryStatItem>
                                <SummaryStatValue>{formatNumber(totals.totalDefeated)}</SummaryStatValue>
                                <SummaryStatLabel>총 처치 횟수</SummaryStatLabel>
                            </SummaryStatItem>
                            <SummaryStatItem>
                                <SummaryStatValue>{formatNumber(totals.totalScore)}</SummaryStatValue>
                                <SummaryStatLabel>총 획득 점수</SummaryStatLabel>
                            </SummaryStatItem>
                        </SummaryStats>
                        <SummaryStats>
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
                            <InsightBannerTitle>환경 영향 인사이트</InsightBannerTitle>
                            {insights.map((insight, index) => (
                                <InsightSlide
                                    key={index}
                                    $isActive={index === currentInsightIndex}
                                >
                                    <InsightContent>
                                        {(() => {
                                            const content = insight.content;

                                            // 텍스트를 파싱하여 JSX 요소로 변환
                                            const parseContent = (text: string) => {
                                                const parts = [];
                                                let currentIndex = 0;

                                                // highlight 태그와 닉네임을 동시에 처리
                                                const regex = /<highlight>(.*?)<\/highlight>/g;
                                                let match;

                                                while ((match = regex.exec(text)) !== null) {
                                                    // 태그 이전 텍스트 추가 (닉네임 처리 포함)
                                                    if (match.index > currentIndex) {
                                                        const beforeText = text.slice(currentIndex, match.index);
                                                        const beforeParts = beforeText.split(user.nickname);

                                                        beforeParts.forEach((part, i) => {
                                                            if (i > 0) {
                                                                // 닉네임 추가
                                                                parts.push(
                                                                    <InsightHighlight key={`nickname-${parts.length}`}>
                                                                        {user.nickname}
                                                                    </InsightHighlight>,
                                                                );
                                                            }
                                                            if (part) {
                                                                parts.push(part);
                                                            }
                                                        });
                                                    }

                                                    // highlight 태그 내용 추가
                                                    parts.push(
                                                        <InsightHighlight key={`highlight-${parts.length}`}>
                                                            {match[1]}
                                                        </InsightHighlight>,
                                                    );

                                                    currentIndex = match.index + match[0].length;
                                                }

                                                // 남은 텍스트 추가 (닉네임 처리 포함)
                                                if (currentIndex < text.length) {
                                                    const remainingText = text.slice(currentIndex);
                                                    const remainingParts = remainingText.split(user.nickname);

                                                    remainingParts.forEach((part, i) => {
                                                        if (i > 0) {
                                                            // 닉네임 추가
                                                            parts.push(
                                                                <InsightHighlight key={`nickname-${parts.length}`}>
                                                                    {user.nickname}
                                                                </InsightHighlight>,
                                                            );
                                                        }
                                                        if (part) {
                                                            parts.push(part);
                                                        }
                                                    });
                                                }

                                                return parts;
                                            };

                                            return parseContent(content);
                                        })()}
                                    </InsightContent>
                                </InsightSlide>
                            ))}
                        </InsightBannerContainer>
                    )}
                </ContentWrapper>
            </Container>
        </TransitionWrapper>
    );
};

export default MedalScreen;
