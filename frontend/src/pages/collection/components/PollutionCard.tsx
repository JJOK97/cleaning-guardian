import React from 'react';
import { Pollution } from '@/types/collection';

interface PollutionCardProps {
    pollution: Pollution;
    onClick: () => void;
}

const PollutionCard: React.FC<PollutionCardProps> = ({ pollution, onClick }) => {
    return (
        <div
            className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                !pollution.isCollected ? 'grayscale' : ''
            }`}
            onClick={onClick}
        >
            <div className='aspect-square rounded-lg overflow-hidden bg-white shadow-md'>
                <img src={pollution.polImg1} alt={pollution.polName} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300' />
            </div>
            <div className='mt-2 text-center'>
                <h3 className='text-sm font-medium text-gray-800'>{pollution.polName}</h3>
                {pollution.isCollected && (
                    <span className='inline-block px-2 py-1 mt-1 text-xs font-medium text-white bg-primary rounded-full'>수집됨</span>
                )}
            </div>
        </div>
    );
};

export default PollutionCard;
