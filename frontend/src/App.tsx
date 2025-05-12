import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme/theme';
import { GlobalStyle } from './styles/theme/GlobalStyle';
import AppRoutes from './routes';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Router>
                <AppRoutes />
            </Router>
        </ThemeProvider>
    );
};

export default App;
