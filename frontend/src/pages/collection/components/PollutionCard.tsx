import React from 'react';
import { Pollution } from '@/types/collection';
import './PollutionCard.css';

/**
 * 오염물질 카드 컴포넌트
 *
 * 게임 로직 개선 관련 기능:
 * 1. 수집 상태 표시 - 게임에서 처치 여부에 따른 시각적 구분
 * 2. 오염물질 정보 표시 - DB 기반 실제 오염물질 데이터 표시
 *
 * TODO: 게임 로직 개선 후 추가 기능
 * - 처치 횟수 표시
 * - 획득 점수 표시
 * - 최근 처치 일시 표시
 * - 희귀도별 카드 스타일 구분
 */

interface PollutionCardProps {
    pollution: Pollution; // DB pollutions 테이블 기반 오염물질 정보
    onClick: () => void; // 상세 정보 모달 열기
}

const PollutionCard: React.FC<PollutionCardProps> = ({ pollution, onClick }) => {
    return (
        <div
            className={`pollution-card ${!pollution.collected ? 'not-collected' : ''}`}
            onClick={onClick}
        >
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
                오염물질 정보
                게임 로직 개선: DB 기반 실제 오염물질 이름과 수집 상태 표시
            */}
            <div className='card-info'>
                <h3>{pollution.polName}</h3>
                {/* 
                    수집 상태 배지
                    게임 로직 개선: 게임에서 실제로 처치한 경우에만 "수집됨" 표시
                */}
                {pollution.collected && <span className='collected-badge'>수집됨</span>}

                {/* TODO: 게임 로직 개선 후 추가 정보 표시
                {pollution.collectionCount > 0 && (
                    <div className='collection-stats'>
                        <span className='collection-count'>처치 {pollution.collectionCount}회</span>
                    </div>
                )}
                */}
            </div>
        </div>
    );
};

export default PollutionCard;
