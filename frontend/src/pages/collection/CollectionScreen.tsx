import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Pollution } from '@/types/collection';
import { getAllPollutions, getUserCollections } from '@/api/collection';
import PollutionCard from './components/PollutionCard';
import './CollectionScreen.css';
import CollectionHeader from './components/CollectionHeader';
import PollutionDetailModal from './components/PollutionDetailModal';
import LoadingScreen from '@/components/common/LoadingScreen';

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

const CollectionScreen: React.FC = () => {
    const { user } = useAuth();
    const [pollutions, setPollutions] = useState<Pollution[]>([]); // DB에서 가져온 전체 오염물질 데이터
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPollution, setSelectedPollution] = useState<Pollution | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                // 사용자별 수집 목록 API 호출
                // 게임 로직 개선: 게임에서 처치한 오염물질들이 여기에 반영됨
                const collectionsData = await getUserCollections(user.email);

                if (collectionsData.success) {
                    setPollutions(collectionsData.data.pollutions);
                } else {
                    console.error('API 응답 실패:', collectionsData);
                    setError('데이터를 불러오는데 실패했습니다.');
                }
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
        setSelectedPollution(pollution);
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
                    <div className='pollution-grid'>
                        {collectedPollutions.map((pollution) => (
                            <PollutionCard
                                key={pollution.polIdx}
                                pollution={pollution}
                                onClick={() => handleCardClick(pollution)}
                            />
                        ))}
                    </div>
                </div>

                {/* 
                    미수집 섹션
                    게임 로직 개선: 아직 게임에서 처치하지 않은 오염물질들 표시
                */}
                <div className='collection-section'>
                    <h2>미수집</h2>
                    <div className='pollution-grid'>
                        {notCollectedPollutions.map((pollution) => (
                            <PollutionCard
                                key={pollution.polIdx}
                                pollution={pollution}
                                onClick={() => handleCardClick(pollution)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 
                오염물질 상세 정보 모달
                게임 로직 개선: 처치 횟수, 획득 점수 등 게임 통계 정보 표시
            */}
            {isModalOpen && selectedPollution && (
                <PollutionDetailModal
                    pollution={selectedPollution}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default CollectionScreen;
