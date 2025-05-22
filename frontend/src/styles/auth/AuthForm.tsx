import styled, { keyframes } from 'styled-components';

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
  100% { transform: translateX(0); }
`;

export const Input = styled.input<{ $error?: boolean; $shake?: boolean }>`
    width: 260px;
    height: 40px;
    margin-bottom: 1rem;
    border-radius: 20px;
    border: none;
    padding: 0 1rem;
    font-size: 1rem;
    background: #e0e0e0;
    color: #222;
    transition: all 0.2s ease;
    animation: ${({ $shake }) => ($shake ? shake : 'none')} 0.2s linear;
    border: ${({ $error }) => ($error ? '2px solid #ff5252' : 'none')};

    &::placeholder {
        color: ${({ $error }) => ($error ? '#ff5252' : '#bdbdbd')};
        opacity: 1;
        font-size: 0.9rem;
        font-weight: 600;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${({ $error }) => ($error ? '#ff5252' : '#19c37d')};
    }
`;

export const ErrorInput = styled.div`
    color: #ff5252;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    width: 260px;
    padding-left: 1rem;
`;

export const Button = styled.button`
    width: 260px;
    height: 44px;
    border-radius: 22px;
    background: #19c37d;
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    margin-bottom: 1rem;
    cursor: pointer;
    box-shadow: 0 2px 8px #2222;
`;

export const LinkRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 260px;
    font-size: 0.95rem;
    color: #fff;
    text-shadow: 1px 1px 4px #222;
`;

export const LinkBtn = styled.span`
    cursor: pointer;
    margin-left: 8px;
`;

export const ErrorMsg = styled.div`
    color: #ff5252;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    text-align: center;
`;
