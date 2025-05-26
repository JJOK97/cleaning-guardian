import React, { useState, useEffect } from 'react';
import { Circle, Group, Image } from 'react-konva';

interface PollutantProps {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    color: string;
    opacity?: number;
    onRemove?: () => void;
    // 게임 로직 개선: 오염물질 이미지 추가
    pollutionImage?: string;
    pollutionName?: string;
}

const Pollutant: React.FC<PollutantProps> = ({
    x,
    y,
    angle,
    radius,
    color,
    opacity = 1,
    onRemove,
    pollutionImage,
    pollutionName,
}) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    // 이미지 로딩
    useEffect(() => {
        if (pollutionImage) {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => setImage(img);
            img.onerror = () => {
                console.warn(`오염물질 이미지 로딩 실패: ${pollutionImage}`);
                setImage(null);
            };
            img.src = `/assets/img/pollution/${pollutionImage}`;
        }
    }, [pollutionImage]);

    return (
        <Group
            x={x}
            y={y}
            rotation={angle * (180 / Math.PI)}
            opacity={opacity}
            onClick={onRemove}
            onTap={onRemove}
        >
            {/* 오염물질 이미지 */}
            {image ? (
                // 이미지만 표시 (배경 원형 제거)
                <Image
                    image={image}
                    x={-radius}
                    y={-radius}
                    width={radius * 2}
                    height={radius * 2}
                    opacity={1}
                    shadowColor='black'
                    shadowBlur={8}
                    shadowOpacity={0.4}
                    shadowOffset={{ x: 2, y: 2 }}
                />
            ) : (
                // 이미지가 없을 때만 기본 원형 표시
                <>
                    <Circle
                        radius={radius}
                        fill={color}
                        shadowColor='black'
                        shadowBlur={10}
                        shadowOpacity={0.3}
                        shadowOffset={{ x: 0, y: 2 }}
                        opacity={0.8}
                    />
                    <Circle
                        radius={radius * 0.8}
                        fill={color}
                        opacity={0.6}
                    />
                    <Circle
                        radius={radius * 0.6}
                        fill={color}
                        opacity={0.4}
                    />
                    {/* 하이라이트 효과 */}
                    <Circle
                        radius={radius * 0.3}
                        fill='white'
                        opacity={0.2}
                        x={-radius * 0.2}
                        y={-radius * 0.2}
                    />
                </>
            )}
        </Group>
    );
};

export default Pollutant;
