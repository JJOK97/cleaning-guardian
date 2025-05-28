import React from 'react';
import { Pollution } from '@/types/collection';
import './PollutionCard.css';

/**
 * 오염물질 카드 컴포넌트 - 모바일 최적화
 *
 * 게임 로직 개선 관련 기능:
 * 1. 수집 상태 표시 - 게임에서 처치 여부에 따른 시각적 구분
 * 2. 오염물질 정보 표시 - DB 기반 실제 오염물질 데이터 표시
 * 3. 가로 스크롤 최적화 - 모바일 스와이프 지원
 */

interface PollutionCardProps {
    pollution: Pollution; // DB pollutions 테이블 기반 오염물질 정보
    onClick: () => void; // 상세 정보 모달 열기
}

/**
 * 오염물질 타입에 따른 라벨 반환
 */
const getTypeInfo = (type: string) => {
    switch (type) {
        case 'W':
            return { label: '💧', className: 'water' };
        case 'L':
            return { label: '🌱', className: 'land' };
        case 'A':
            return { label: '💨', className: 'air' };
        default:
            return { label: '🌍', className: 'environment' };
    }
};

const PollutionCard: React.FC<PollutionCardProps> = ({ pollution, onClick }) => {
    const typeInfo = getTypeInfo(pollution.type);

    return (
        <div
            className={`pollution-card ${!pollution.collected ? 'not-collected' : ''}`}
            data-type={pollution.type}
            onClick={onClick}
        >
            {/* 타입 배지 - 간소화 */}
            {pollution.type && <div className={`type-badge ${typeInfo.className}`}>{typeInfo.label}</div>}

            {/* 
                오염물질 이미지
                게임 로직 개선: DB의 polImg1을 사용하여 실제 오염물질 이미지 표시
            */}
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

            {/* 
                오염물질 정보 - 간소화
                게임 로직 개선: DB 기반 실제 오염물질 이름과 수집 상태 표시
            */}
            <div className='card-info'>
                <h3>{pollution.polName}</h3>

                {/* 
                    수집 상태 배지
                    게임 로직 개선: 게임에서 실제로 처치한 경우에만 "✓" 표시
                */}
                {pollution.collected && <span className='collected-badge'>✓</span>}
            </div>
        </div>
    );
};

export default PollutionCard;
