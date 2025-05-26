import React from 'react';
import { Progress } from '@/components/ui/progress';

/**
 * 수집 진행률 헤더 컴포넌트
 *
 * 게임 로직 개선 관련 기능:
 * 1. 실시간 수집 진행률 표시 - 게임 플레이를 통한 실제 수집 데이터 기반
 * 2. 수집 통계 표시 - 전체 오염물질 대비 수집 완료 현황
 *
 * TODO: 게임 로직 개선 후 추가 기능
 * - 최근 수집한 오염물질 표시
 * - 수집 목표 달성률 표시
 * - 수집 보상 진행률 표시
 */

interface CollectionHeaderProps {
    totalCount: number; // 전체 오염물질 수 (DB pollutions 테이블 기준)
    collectedCount: number; // 수집 완료된 오염물질 수 (게임에서 처치한 것들)
    completionRate: number; // 수집 완료율 (게임 플레이 성과 지표)
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
                        {/* 게임 로직 개선: 실제 게임에서 처치한 오염물질 수 / 전체 오염물질 수 */}
                    </span>
                </div>
                {/* 
                    진행률 바
                    게임 로직 개선: 게임 플레이를 통한 실제 수집 성과를 시각적으로 표시
                */}
                <Progress value={completionRate} />
                <div className='mt-1 text-right'>
                    <span className='text-sm font-medium text-primary'>{completionRate.toFixed(1)}%</span>
                    {/* TODO: 게임 로직 개선 후 추가 정보
                    <span className='text-xs text-gray-500 ml-2'>
                        목표까지 {(100 - completionRate).toFixed(1)}%
                    </span>
                    */}
                </div>
            </div>
        </div>
    );
};

export default CollectionHeader;
