import React, { useMemo } from 'react';
import { Line } from 'react-konva';

interface SliceTrailProps {
    points: number[];
}

const SliceTrail: React.FC<SliceTrailProps> = ({ points }) => {
    // 트레일 대시 패턴 (실선과 빈 공간 교차)
    const dashPattern = useMemo(() => [10, 5], []);

    return (
        <>
            {/* 메인 슬라이스 트레일 - 베는 범위와 일치하도록 두껍게 */}
            <Line
                points={points}
                stroke='#FFFFFF'
                strokeWidth={20}
                lineCap='round'
                lineJoin='round'
                opacity={0.4}
                shadowColor='#4CAF50'
                shadowBlur={20}
                shadowOpacity={0.6}
                shadowOffset={{ x: 0, y: 0 }}
            />

            {/* 트레일 효과 - 대시 라인 */}
            <Line
                points={points}
                stroke='#4CAF50'
                strokeWidth={12}
                lineCap='round'
                lineJoin='round'
                opacity={0.6}
                dash={dashPattern}
            />

            {/* 트레일 효과 - 가운데 라인 */}
            <Line
                points={points}
                stroke='#FFFFFF'
                strokeWidth={6}
                lineCap='round'
                lineJoin='round'
                opacity={0.8}
            />
        </>
    );
};

export default SliceTrail;
