import React from 'react';
import styled from 'styled-components';

interface GameBackgroundProps {
    backgroundImage?: string;
}

const Container = styled.div<{ $backgroundImage?: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $backgroundImage }) =>
        $backgroundImage
            ? `url(${$backgroundImage}) center center / cover no-repeat, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'};
    overflow: hidden;
`;

const GameBackground: React.FC<GameBackgroundProps> = ({ backgroundImage }) => {
    return <Container $backgroundImage={backgroundImage} />;
};

export default GameBackground;
