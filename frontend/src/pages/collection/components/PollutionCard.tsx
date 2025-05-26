import React from 'react';
import { Pollution } from '@/types/collection';
import './PollutionCard.css';

interface PollutionCardProps {
    pollution: Pollution;
    onClick: () => void;
}

const PollutionCard: React.FC<PollutionCardProps> = ({ pollution, onClick }) => {
    return (
        <div
            className={`pollution-card ${!pollution.collected ? 'not-collected' : ''}`}
            onClick={onClick}
        >
            <div className='image-container'>
                <img
                    src={`/assets/img/pollution/${pollution.polImg1}`}
                    alt={pollution.polName}
                    onError={(e) => {
                        console.error(`이미지 로드 실패: ${pollution.polImg1}`);
                        e.currentTarget.src = '/assets/img/pollution/pet.png';
                    }}
                />
            </div>
            <div className='card-info'>
                <h3>{pollution.polName}</h3>
                {pollution.collected && <span className='collected-badge'>수집됨</span>}
            </div>
        </div>
    );
};

export default PollutionCard;
