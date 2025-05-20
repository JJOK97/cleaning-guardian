import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes';
import { GlobalStyle } from './styles/theme/GlobalStyle';
import { theme } from './styles/theme/theme';
import './index.css';
import * as serviceWorkerRegistration from '@/serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
);

// 서비스 워커 등록
serviceWorkerRegistration.register();
