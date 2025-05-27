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
    // 처치 상태 표시
    isDefeated?: boolean;
    // 오염 폭탄 타입
    isPollutionBomb?: boolean;
}

// 이미지 캐시 - 같은 이미지를 여러 번 로딩하지 않도록
const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

const loadImage = (src: string): Promise<HTMLImageElement> => {
    // 이미 캐시된 이미지가 있으면 즉시 반환
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
    }

    // 이미 로딩 중인 이미지가 있으면 해당 Promise 반환
    if (loadingPromises.has(src)) {
        return loadingPromises.get(src)!;
    }

    // 새로운 이미지 로딩
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imageCache.set(src, img);
            loadingPromises.delete(src);
            resolve(img);
        };
        img.onerror = () => {
            loadingPromises.delete(src);
            reject(new Error(`이미지 로딩 실패: ${src}`));
        };
        img.src = src;
    });

    loadingPromises.set(src, promise);
    return promise;
};

// 컴포넌트를 직접 정의하고 export
function Pollutant({
    x,
    y,
    angle,
    radius,
    color,
    opacity = 1,
    onRemove,
    pollutionImage,
    pollutionName,
    isDefeated = false,
    isPollutionBomb = false,
}: PollutantProps) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [blinkOpacity, setBlinkOpacity] = useState(1);

    // 이미지 로딩 (캐시 사용) - 깜빡임 방지 개선
    useEffect(() => {
        if (pollutionImage) {
            // 폭탄 이미지는 ingame 폴더에서 로딩
            const imageSrc = isPollutionBomb
                ? `/assets/img/ingame/${pollutionImage}`
                : `/assets/img/pollution/${pollutionImage}`;

            // 캐시된 이미지가 있으면 즉시 설정
            if (imageCache.has(imageSrc)) {
                setImage(imageCache.get(imageSrc)!);
                setImageLoaded(true);
                return;
            }

            // 이미지 로딩 시작 - 상태는 변경하지 않음 (깜빡임 방지)
            loadImage(imageSrc)
                .then((img) => {
                    // 이미지 로딩 완료 시에만 상태 변경
                    setImage(img);
                    setImageLoaded(true);
                })
                .catch((error) => {
                    // 이미지 로딩 실패 시 원형 유지
                    setImage(null);
                    setImageLoaded(false);
                });
        } else {
            // 이미지가 없으면 기본 원형 사용
            setImage(null);
            setImageLoaded(false);
        }
    }, [pollutionImage, isPollutionBomb]);

    // 폭탄 깜빡임 효과 + 처치된 오염물질 깜빡임 효과
    useEffect(() => {
        if ((isPollutionBomb && !isDefeated) || isDefeated) {
            const blinkInterval = setInterval(() => {
                setBlinkOpacity((prev) => (prev === 1 ? 0.3 : 1));
            }, 300); // 0.3초마다 깜빡임

            return () => clearInterval(blinkInterval);
        } else {
            setBlinkOpacity(1);
        }
    }, [isPollutionBomb, isDefeated]);

    // 렌더링 결정: 이미지 우선, 로딩 실패 시에만 원형 사용
    const shouldShowImage = imageLoaded && image;

    return (
        <Group
            x={x}
            y={y}
            rotation={angle * (180 / Math.PI)}
            opacity={(isPollutionBomb && !isDefeated) || isDefeated ? blinkOpacity : 1} // 폭탄과 처치된 오염물질 모두 깜빡임
            onClick={onRemove}
            onTap={onRemove}
            // 렌더링 최적화 (회전 포함)
            perfectDrawEnabled={false}
            transformsEnabled='all'
        >
            {shouldShowImage ? (
                /* 이미지가 있으면 이미지만 표시 */
                <>
                    <Image
                        image={image!}
                        x={-radius}
                        y={-radius}
                        width={radius * 2}
                        height={radius * 2}
                        opacity={isDefeated ? 0.5 : 1} // 처치되면 반투명
                        // 그림자 제거로 성능 개선
                        perfectDrawEnabled={false} // 픽셀 퍼펙트 비활성화로 성능 개선
                        // listening은 true로 유지해서 클릭 가능하게
                    />
                </>
            ) : (
                /* 이미지가 없으면 원형만 표시 (크기 축소) */
                <Circle
                    radius={radius * 0.7} // 🎯 원형 크기 70%로 축소
                    fill={color} // 원래 색상 유지
                    // 그림자 제거로 성능 개선
                    opacity={isDefeated ? 0.8 : 1} // 처치되면 약간 투명
                    perfectDrawEnabled={false} // 픽셀 퍼펙트 비활성화로 성능 개선
                    // listening은 true로 유지해서 클릭 가능하게
                />
            )}
        </Group>
    );
}

export default Pollutant;
