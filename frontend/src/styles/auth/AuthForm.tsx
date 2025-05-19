import styled from 'styled-components';

export const Input = styled.input`
    width: 260px;
    height: 40px;
    margin-bottom: 1rem;
    border-radius: 20px;
    border: none;
    padding: 0 1rem;
    font-size: 1rem;
    background: #e0e0e0;
    &::placeholder {
        color: #bdbdbd;
        opacity: 1;
    }
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
    text-decoration: underline;
    margin-left: 8px;
`;

export const ErrorMsg = styled.div`
    color: #ff5252;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    text-align: center;
`;
