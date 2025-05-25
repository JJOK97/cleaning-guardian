import React from 'react';
import { Progress } from '@/components/ui/progress';

interface CollectionHeaderProps {
    totalCount: number;
    collectedCount: number;
    completionRate: number;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ totalCount, collectedCount, completionRate }) => {
    return (
        <div className='flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow'>
            <h1 className='text-2xl font-bold text-gray-800'>오염물질 도감</h1>
            <div className='w-full max-w-md'>
                <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-600'>수집 진행률</span>
                    <span className='text-sm font-medium text-gray-800'>
                        {collectedCount} / {totalCount}
                    </span>
                </div>
                <Progress value={completionRate} />
                <div className='mt-1 text-right'>
                    <span className='text-sm font-medium text-primary'>{completionRate.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};

export default CollectionHeader;
