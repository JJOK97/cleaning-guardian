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
            {/* 메인 슬라이스 트레일 */}
            <Line
                points={points}
                stroke='#FFFFFF'
                strokeWidth={8}
                lineCap='round'
                lineJoin='round'
                opacity={0.5}
                shadowColor='#4CAF50'
                shadowBlur={15}
                shadowOpacity={0.8}
                shadowOffset={{ x: 0, y: 0 }}
            />

            {/* 트레일 효과 - 대시 라인 */}
            <Line
                points={points}
                stroke='#4CAF50'
                strokeWidth={4}
                lineCap='round'
                lineJoin='round'
                opacity={0.7}
                dash={dashPattern}
            />

            {/* 트레일 효과 - 가운데 라인 */}
            <Line
                points={points}
                stroke='#FFFFFF'
                strokeWidth={2}
                lineCap='round'
                lineJoin='round'
                opacity={0.9}
            />
        </>
    );
};

export default SliceTrail;
