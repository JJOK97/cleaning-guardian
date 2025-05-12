import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    overflow: hidden;
`;

const GameBackground: React.FC = () => {
    return <Container />;
};

export default GameBackground;
