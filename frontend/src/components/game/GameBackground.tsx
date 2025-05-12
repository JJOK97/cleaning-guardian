import React from 'react';
import { Layer, Rect, Circle } from 'react-konva';

const GameBackground: React.FC = () => {
    return (
        <Layer>
            {/* 그라데이션 배경 */}
            <Rect
                x={0}
                y={0}
                width={window.innerWidth}
                height={window.innerHeight}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: window.innerHeight }}
                fillLinearGradientColorStops={[0, '#1a237e', 1, '#0d47a1']}
            />

            {/* 배경 패턴 */}
            {Array.from({ length: 50 }).map((_, i) => (
                <Circle
                    key={i}
                    x={Math.random() * window.innerWidth}
                    y={Math.random() * window.innerHeight}
                    radius={Math.random() * 3 + 1}
                    fill='rgba(255,255,255,0.1)'
                />
            ))}
        </Layer>
    );
};

export default GameBackground;
