import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styled, { keyframes } from 'styled-components';
import { Pollution } from '@/types/collection';
import { getAllPollutions, getUserCollections } from '@/api/collection';
import PollutionCard from './components/PollutionCard';
import './CollectionScreen.css';
import CollectionHeader from './components/CollectionHeader';
import PollutionDetailModal from './components/PollutionDetailModal';
import LoadingScreen from '@/components/common/LoadingScreen';

/**
 * 사용자 수집 통계 정보 (MedalScreen과 동일한 타입)
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

/**
 * 오염물질 수집 도감 화면
 *
 * 게임 로직 개선 관련 기능:
 * 1. 수집 데이터 추적 - 게임에서 처치한 오염물질들의 수집 현황 표시
 * 2. 오염물질 정보 표시 - DB 기반 실제 오염물질 데이터 표시
 * 3. 수집 진행률 추적 - 전체 오염물질 대비 수집 완료율
 *
 * TODO: 게임 로직 개선 후 추가 기능
 * - 게임 결과와 연동하여 실시간 수집 데이터 업데이트
 * - 오염물질별 처치 횟수 통계
 * - 수집 보상 시스템 연동
 */

// MedalScreen에서 사용한 fadeIn 애니메이션을 그대로 활용
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

// 컬렉션 전체 화면을 감싸는 애니메이션 래퍼
const AnimatedContainer = styled.div`
    animation: ${fadeIn} 0.6s ease-out;
    width: 100%;
    height: 100%;

    /* CSS 파일의 스타일보다 우선순위를 높이기 위해 */
    & > .collection-screen {
        animation: ${fadeIn} 0.8s ease-out;
    }

    /* 각 섹션에도 순차적 애니메이션 적용 */
    & .collection-section {
        animation: ${fadeIn} 1s ease-out;
        animation-fill-mode: both;

        &:nth-child(1) {
            animation-delay: 0.2s;
        }

        &:nth-child(2) {
            animation-delay: 0.4s;
        }
    }

    /* 헤더에도 애니메이션 적용 */
    & .collection-header {
        animation: ${fadeIn} 0.6s ease-out;
    }
`;

const CollectionScreen: React.FC = () => {
    const { user } = useAuth();
    const [pollutions, setPollutions] = useState<Pollution[]>([]); // DB에서 가져온 전체 오염물질 데이터
    const [collectionStats, setCollectionStats] = useState<UserCollectionStats[]>([]); // 사용자 수집 통계
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPollution, setSelectedPollution] = useState<Pollution | null>(null);
    const [selectedStats, setSelectedStats] = useState<UserCollectionStats | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * 사용자 수집 통계 조회 (MedalScreen과 동일한 API)
     */
    const fetchCollectionStats = async (email: string) => {
        try {
            const response = await fetch(`/api/v1/collection-stats/users/${email}`);
            if (response.ok) {
                const data = await response.json();
                setCollectionStats(data);
                return data;
            }
        } catch (error) {
            console.error('수집 통계 조회 실패:', error);
            return [];
        }
    };

    /**
     * 전체 오염물질 목록 조회
     */
    const fetchAllPollutions = async () => {
        try {
            const response = await getAllPollutions();
            if (response.success) {
                return response.data.pollutions;
            }
        } catch (error) {
            console.error('전체 오염물질 조회 실패:', error);
        }
        return [];
    };

    useEffect(() => {
        /**
         * 사용자별 수집 데이터 조회
         * 게임 로직 개선: 게임 결과에서 user_collection 테이블에 기록된 데이터를 기반으로 표시
         */
        const fetchData = async () => {
            if (!user?.email) {
                return;
            }

            try {
                setLoading(true);

                // 병렬로 데이터 조회
                const [statsData, allPollutionsData] = await Promise.all([
                    fetchCollectionStats(user.email),
                    fetchAllPollutions(),
                ]);

                // 수집 통계와 전체 오염물질 데이터를 결합
                const combinedPollutions = allPollutionsData.map((pollution) => {
                    const stats = statsData.find((stat: UserCollectionStats) => stat.polIdx === pollution.polIdx);
                    return {
                        ...pollution,
                        collected: !!stats,
                        collectionCount: stats?.totalDefeated || 0,
                        totalScore: stats?.totalScore || 0,
                        maxCombo: stats?.maxCombo || 0,
                    };
                });

                setPollutions(combinedPollutions);
            } catch (err) {
                console.error('데이터 로딩 중 에러:', err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.email]);

    /**
     * 오염물질 카드 클릭 핸들러
     * 게임 로직 개선: 수집된 오염물질의 상세 정보와 처치 통계 표시
     */
    const handleCardClick = (pollution: Pollution) => {
        const stats = collectionStats.find((stat) => stat.polIdx === pollution.polIdx);
        setSelectedPollution(pollution);
        setSelectedStats(stats || null);
        setIsModalOpen(true);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>에러: {error}</div>;
    }

    // 수집 완료/미완료 오염물질 분류
    // 게임 로직 개선: collected 플래그는 게임에서 해당 오염물질을 처치했는지 여부를 나타냄
    const collectedPollutions = pollutions.filter((p) => p.collected);
    const notCollectedPollutions = pollutions.filter((p) => !p.collected);

    return (
        <AnimatedContainer>
            <div className='collection-screen'>
                {/* 
                    수집 진행률 헤더
                    게임 로직 개선: 게임 플레이를 통한 실제 수집 진행률 표시
                */}
                <CollectionHeader
                    totalCount={pollutions.length}
                    collectedCount={collectedPollutions.length}
                    completionRate={pollutions.length > 0 ? (collectedPollutions.length / pollutions.length) * 100 : 0}
                />

                <div className='collection-grids'>
                    {/* 
                        수집 완료 섹션
                        게임 로직 개선: 게임에서 실제로 처치한 오염물질들만 표시
                    */}
                    <div className='collection-section'>
                        <h2>수집 완료</h2>
                        {collectedPollutions.length > 0 ? (
                            <div className='pollution-grid'>
                                {collectedPollutions.map((pollution) => (
                                    <PollutionCard
                                        key={pollution.polIdx}
                                        pollution={pollution}
                                        onClick={() => handleCardClick(pollution)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='empty-state'>
                                <div className='empty-icon'>🎮</div>
                                <div className='empty-text'>아직 수집한 오염물질이 없습니다</div>
                                <div className='empty-subtext'>게임을 플레이하여 오염물질을 처치해보세요!</div>
                            </div>
                        )}
                    </div>

                    {/* 
                        미수집 섹션
                        게임 로직 개선: 아직 게임에서 처치하지 않은 오염물질들 표시
                    */}
                    <div className='collection-section'>
                        <h2>미수집</h2>
                        {notCollectedPollutions.length > 0 ? (
                            <div className='pollution-grid'>
                                {notCollectedPollutions.map((pollution) => (
                                    <PollutionCard
                                        key={pollution.polIdx}
                                        pollution={pollution}
                                        onClick={() => handleCardClick(pollution)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='empty-state'>
                                <div className='empty-icon'>🏆</div>
                                <div className='empty-text'>모든 오염물질을 수집했습니다!</div>
                                <div className='empty-subtext'>축하합니다! 완벽한 환경 수호자입니다!</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 
                    오염물질 상세 정보 모달
                    게임 로직 개선: 처치 횟수, 획득 점수 등 게임 통계 정보 표시
                */}
                {isModalOpen && selectedPollution && (
                    <PollutionDetailModal
                        pollution={selectedPollution}
                        collectionStats={selectedStats}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </AnimatedContainer>
    );
};

export default CollectionScreen;
