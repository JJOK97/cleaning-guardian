import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

export const BackgroundWrapper = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
`;

export const Content = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.h1`
    color: #ffd600;
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 8px #222;
`;

export const GuardianWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 13rem;
    height: 13rem;
`;

const float = keyframes`
  0% { transform: translateY(0); }
  20% { transform: translateY(-10px); }
  50% { transform: translateY(-18px); }
  80% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const flash = keyframes`
  0% { filter: brightness(1); text-shadow: none; }
  10% { filter: brightness(2.2); text-shadow: 0 0 24px #fff700, 0 0 48px #fff700; }
  40% { filter: brightness(1.5); }
  70% { filter: brightness(1.15); }
  100% { filter: brightness(1); text-shadow: none; }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  10% { transform: translateX(-2px); }
  20% { transform: translateX(2px); }
  30% { transform: translateX(-1px); }
  40% { transform: translateX(1px); }
  100% { transform: translateX(0); }
`;

export const Guardian = styled.img`
    width: 13rem;
    height: 13rem;
    object-fit: contain;
    animation: ${float} 3.5s ease-in-out infinite, ${flash} 3.5s linear infinite;
    z-index: 1;
`;

const lightningAnim = keyframes`
  0%, 90%, 100% { opacity: 0; transform: translateY(0) scale(1); }
  20% { opacity: 0.2; }
  50% { opacity: 1; transform: translateY(-18px) scale(1.15); }
  80% { opacity: 0.2; }
  93% { opacity: 1; filter: brightness(2.2); }
  95% { opacity: 0.7; }
  97% { opacity: 1; }
`;

export const LightningRotateWrapper = styled.div<{ $left?: boolean }>`
    position: absolute;
    top: -2.5rem;
    ${({ $left }) =>
        $left
            ? css`
                  right: 90%;
                  left: auto;
                  transform: rotate(-40deg);
              `
            : css`
                  left: 90%;
                  right: auto;
                  transform: rotate(20deg);
              `}
    z-index: 2;
`;

export const Lightning = styled.div`
    font-size: 3.5rem;
    color: #ffe600;
    text-shadow: 0 0 16px #fff700, 0 0 32px #fff700;
    opacity: 0;
    pointer-events: none;
    animation: ${lightningAnim} 3.5s ease-in-out infinite;
`;
