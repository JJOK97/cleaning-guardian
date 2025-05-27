import React, { useMemo } from 'react';
import { Line } from 'react-konva';

interface SliceTrailProps {
    points: number[];
    opacity?: number;
    isAfterimage?: boolean;
}

const SliceTrail: React.FC<SliceTrailProps> = ({ points, opacity = 1, isAfterimage = false }) => {
    // 현재 슬라이스는 전체 경로 표시, 잔상은 적당한 길이로 제한
    const displayPoints = useMemo(() => {
        if (!isAfterimage) {
            // 현재 드래그 중인 슬라이스는 전체 경로 표시
            return points;
        } else {
            // 잔상도 더 길게 표시 (성능상 이유로 적당히 제한)
            if (points.length <= 24) return points; // 12개 포인트 이하면 전체 표시
            return points.slice(-24); // 마지막 24개 값 (12개 포인트)
        }
    }, [points, isAfterimage]);

    return (
        <>
            {/* 메인 슬라이스 트레일 - 검처럼 두껍게 */}
            <Line
                points={displayPoints}
                stroke={isAfterimage ? '#E3F2FD' : '#FFFFFF'}
                strokeWidth={isAfterimage ? 8 : 15} // 훨씬 더 두껍게
                lineCap='round'
                lineJoin='round'
                opacity={opacity * (isAfterimage ? 0.4 : 0.7)}
                shadowColor='#2196F3'
                shadowBlur={isAfterimage ? 6 : 15} // 더 강한 그림자
                shadowOpacity={opacity * (isAfterimage ? 0.4 : 0.6)}
                shadowOffset={{ x: 0, y: 0 }}
            />

            {/* 트레일 효과 - 가운데 라인 (더 두껍게) */}
            <Line
                points={displayPoints}
                stroke={isAfterimage ? '#64B5F6' : '#2196F3'}
                strokeWidth={isAfterimage ? 4 : 8} // 가운데 라인도 두껍게
                lineCap='round'
                lineJoin='round'
                opacity={opacity * (isAfterimage ? 0.6 : 0.8)}
            />

            {/* 내부 코어 라인 - 날카로운 느낌 */}
            <Line
                points={displayPoints}
                stroke={isAfterimage ? '#BBDEFB' : '#E3F2FD'}
                strokeWidth={isAfterimage ? 1 : 2}
                lineCap='round'
                lineJoin='round'
                opacity={opacity * (isAfterimage ? 0.8 : 1)}
            />
        </>
    );
};

export default SliceTrail;
