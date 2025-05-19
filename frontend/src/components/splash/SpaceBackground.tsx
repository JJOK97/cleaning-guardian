import React from 'react';
import { Star, SpaceParticle, Planet, PlanetRing, CleaningIcon } from '@/styles/components/splash/elements';

interface SpaceBackgroundProps {
    fixedStars: Array<{
        id: number;
        size: number;
        top: number;
        left: number;
        delay: number;
    }>;
    spaceParticles: Array<{
        id: number;
        size: number;
        top: number;
        left: number;
        delay: number;
        duration: number;
    }>;
    planets: Array<{
        id: number;
        size: number;
        top: number;
        left: number;
        color: string;
        duration: number;
        zIndex: number;
    }>;
    planetRings: Array<{
        id: number;
        size: number;
        top: number;
        left: number;
        color: string;
        rotation: number;
    }>;
    cleaningIcons: Array<{
        id: number;
        emoji: string;
        size: number;
        top: number;
        left: number;
        rotation: number;
    }>;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
    fixedStars,
    spaceParticles,
    planets,
    planetRings,
    cleaningIcons,
}) => {
    return (
        <>
            {fixedStars.map((star) => (
                <Star
                    key={star.id}
                    $size={star.size}
                    $top={star.top}
                    $left={star.left}
                    $delay={star.delay}
                />
            ))}

            {spaceParticles.map((particle) => (
                <SpaceParticle
                    key={particle.id}
                    $size={particle.size}
                    $top={particle.top}
                    $left={particle.left}
                    $delay={particle.delay}
                    $duration={particle.duration}
                />
            ))}

            {planets.map((planet) => (
                <Planet
                    key={planet.id}
                    $size={planet.size}
                    $top={planet.top}
                    $left={planet.left}
                    $color={planet.color}
                    $duration={planet.duration}
                    $zIndex={planet.zIndex}
                />
            ))}

            {planetRings.map((ring) => (
                <PlanetRing
                    key={ring.id}
                    $size={ring.size}
                    $top={ring.top}
                    $left={ring.left}
                    $color={ring.color}
                    $rotation={ring.rotation}
                />
            ))}

            {cleaningIcons.map((icon) => (
                <CleaningIcon
                    key={icon.id}
                    $size={icon.size}
                    $top={icon.top}
                    $left={icon.left}
                    $rotation={icon.rotation}
                >
                    {icon.emoji}
                </CleaningIcon>
            ))}
        </>
    );
};
