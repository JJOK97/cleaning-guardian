import React from 'react';
import { Pollution } from '@/types/collection';

interface PollutionDetailModalProps {
    pollution: Pollution;
    onClose: () => void;
}

const PollutionDetailModal: React.FC<PollutionDetailModalProps> = ({ pollution, onClose }) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-xl'>
                <div className='flex justify-between items-start mb-4'>
                    <h2 className='text-xl font-bold text-gray-800'>{pollution.polName}</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                <div className='space-y-4'>
                    <div className='aspect-video rounded-lg overflow-hidden'>
                        <img src={pollution.polImg1} alt={pollution.polName} className='w-full h-full object-cover' />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='aspect-square rounded-lg overflow-hidden'>
                            <img src={pollution.polImg2} alt='상세 이미지 1' className='w-full h-full object-cover' />
                        </div>
                        <div className='aspect-square rounded-lg overflow-hidden'>
                            <img src={pollution.polImg3} alt='상세 이미지 2' className='w-full h-full object-cover' />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <p className='text-gray-600'>{pollution.polDesc}</p>
                        <div className='flex justify-between items-center text-sm text-gray-500'>
                            <span>타입: {pollution.type}</span>
                            <span>수집 횟수: {pollution.collectionCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollutionDetailModal;
