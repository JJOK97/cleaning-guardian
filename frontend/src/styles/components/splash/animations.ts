import { keyframes } from 'styled-components';

export const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

export const float = keyframes`
  0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-10px) translateX(10px) rotate(5deg); }
  50% { transform: translateY(0px) translateX(20px) rotate(0deg); }
  75% { transform: translateY(10px) translateX(10px) rotate(-5deg); }
  100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;
