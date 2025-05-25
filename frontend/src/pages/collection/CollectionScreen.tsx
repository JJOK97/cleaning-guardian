import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCollectionCompletion } from '@/api/collection';
import { CollectionData, Pollution } from '@/types/collection';
import CollectionHeader from './components/CollectionHeader';
import PollutionCard from './components/PollutionCard';
import PollutionDetailModal from './components/PollutionDetailModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CollectionScreen: React.FC = () => {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState<CollectionData | null>(null);
    const [selectedPollution, setSelectedPollution] = useState<Pollution | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCollectionData = async () => {
            if (!user?.email) return;

            try {
                setIsLoading(true);
                const response = await getCollectionCompletion(user.email);
                if (response.data) {
                    setCollectionData(response.data as CollectionData);
                }
            } catch (error) {
                console.error('도감 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectionData();
    }, [user?.email]);

    const handleCardClick = (pollution: Pollution) => {
        setSelectedPollution(pollution);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <LoadingSpinner />
            </div>
        );
    }

    if (!collectionData) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <p className='text-gray-500'>데이터를 불러올 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <CollectionHeader
                totalCount={collectionData.totalCount}
                collectedCount={collectionData.collectedCount}
                completionRate={collectionData.completionRate}
            />

            <div className='mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {collectionData.pollutions.map((pollution) => (
                    <PollutionCard key={pollution.polIdx} pollution={pollution} onClick={() => handleCardClick(pollution)} />
                ))}
            </div>

            {isModalOpen && selectedPollution && (
                <PollutionDetailModal pollution={selectedPollution} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default CollectionScreen;
