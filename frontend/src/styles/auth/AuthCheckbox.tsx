import styled, { keyframes, css } from 'styled-components';

export const CheckboxRow = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #fff9;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 1.5rem;
    width: 260px;
    box-shadow: 0 2px 8px #2222;
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
  100% { transform: translateX(0); }
`;

export const CheckboxLabel = styled.label<{ $error?: boolean; $shake?: boolean }>`
    font-size: 1rem;
    color: ${({ $error }) => ($error ? '#ff5252' : '#222')};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    ${({ $shake }) =>
        $shake &&
        css`
            animation: ${shake} 0.2s linear;
        `}
`;

export const Checkbox = styled.input`
    margin-right: 8px;
`;
