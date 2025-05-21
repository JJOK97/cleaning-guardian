import { createGlobalStyle } from 'styled-components';
import cafe24SsurroundWoff2 from '@/assets/fonts/Cafe24Ssurround-v2.0.woff2';
import cafe24SsurroundWoff from '@/assets/fonts/Cafe24Ssurround-v2.0.woff';
import cafe24SsurroundTtf from '@/assets/fonts/Cafe24Ssurround-v2.0.ttf';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Cafe24Ssurround';
    src: url(${cafe24SsurroundWoff2}) format('woff2'),
         url(${cafe24SsurroundWoff}) format('woff'),
         url(${cafe24SsurroundTtf}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Cafe24Ssurround', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
