import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Pollution } from '@/types/collection';
import { getAllPollutions, getUserCollections } from '@/api/collection';
import PollutionCard from './components/PollutionCard';
import './CollectionScreen.css';
import CollectionHeader from './components/CollectionHeader';
import PollutionDetailModal from './components/PollutionDetailModal';
import LoadingScreen from '@/components/common/LoadingScreen';

const CollectionScreen: React.FC = () => {
    const { user } = useAuth();
    const [pollutions, setPollutions] = useState<Pollution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPollution, setSelectedPollution] = useState<Pollution | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.email) {
                return;
            }

            try {
                setLoading(true);

                // 사용자별 수집 목록 API만 호출
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

    const collectedPollutions = pollutions.filter((p) => p.collected);
    const notCollectedPollutions = pollutions.filter((p) => !p.collected);

    return (
        <div className='collection-screen'>
            <CollectionHeader
                totalCount={pollutions.length}
                collectedCount={collectedPollutions.length}
                completionRate={pollutions.length > 0 ? (collectedPollutions.length / pollutions.length) * 100 : 0}
            />

            <div className='collection-grids'>
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
