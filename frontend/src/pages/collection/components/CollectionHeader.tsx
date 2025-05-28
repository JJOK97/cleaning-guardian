import React from 'react';
import { Progress } from '@/components/ui/progress';
import styled from 'styled-components';

/**
 * 수집 진행률 헤더 컴포넌트 - 모바일 최적화
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

const HeaderContainer = styled.div`
    background: rgba(255, 248, 220, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 8px 12px;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2), 0 2px 6px rgba(160, 82, 45, 0.1);
    border: 2px solid rgba(139, 69, 19, 0.3);
    position: relative;
    overflow: hidden;
`;

const HeaderGradient = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #8b4513, #d2691e, #8b4513);
    border-radius: 12px 12px 0 0;
`;

const Title = styled.h1`
    font-size: 1rem;
    font-weight: 700;
    color: #8b4513;
    text-align: center;
    margin: 0 0 8px 0;
    text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3);
`;

const ProgressContainer = styled.div`
    width: 100%;
`;

const ProgressHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
`;

const ProgressLabel = styled.span`
    font-size: 0.7rem;
    color: #4a5568;
    font-weight: 600;
`;

const ProgressValue = styled.span`
    font-size: 0.7rem;
    font-weight: 700;
    color: #2d3748;
`;

const ProgressFooter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4px;
`;

const ProgressPercentage = styled.span`
    font-size: 0.9rem;
    font-weight: 700;
    color: #8b4513;
`;

interface CollectionHeaderProps {
    totalCount: number; // 전체 오염물질 수 (DB pollutions 테이블 기준)
    collectedCount: number; // 수집 완료된 오염물질 수 (게임에서 처치한 것들)
    completionRate: number; // 수집 완료율 (게임 플레이 성과 지표)
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ totalCount, collectedCount, completionRate }) => {
    return (
        <HeaderContainer>
            <HeaderGradient />
            <Title>오염물 도감</Title>

            <ProgressContainer>
                <ProgressHeader>
                    <ProgressLabel>진행률</ProgressLabel>
                    <ProgressValue>
                        {collectedCount}/{totalCount}
                    </ProgressValue>
                </ProgressHeader>

                <Progress value={completionRate} />

                <ProgressFooter>
                    <ProgressPercentage>{completionRate.toFixed(1)}%</ProgressPercentage>
                </ProgressFooter>
            </ProgressContainer>
        </HeaderContainer>
    );
};

export default CollectionHeader;
