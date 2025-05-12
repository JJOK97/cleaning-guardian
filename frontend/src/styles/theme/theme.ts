import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
    colors: {
        background: {
            main: '#1a1a2e',
            light: '#16213e',
            dark: '#0f172a',
            card: 'rgba(255, 255, 255, 0.1)',
            overlay: 'rgba(0, 0, 0, 0.8)',
            disabled: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.8)',
            disabled: 'rgba(255, 255, 255, 0.4)',
        },
        primary: {
            main: '#4CAF50',
            light: '#81c784',
            dark: '#45a049',
        },
        secondary: {
            main: '#9370DB',
            light: '#b19cd9',
            dark: '#8A2BE2',
        },
        border: {
            light: 'rgba(255, 255, 255, 0.1)',
            medium: 'rgba(255, 255, 255, 0.2)',
            primary: 'rgba(255, 255, 255, 0.3)',
            disabled: 'rgba(255, 255, 255, 0.05)',
        },
        shadow: {
            light: '0 2px 4px rgba(0, 0, 0, 0.1)',
            medium: '0 4px 8px rgba(0, 0, 0, 0.2)',
            dark: '0 8px 16px rgba(0, 0, 0, 0.3)',
        },
        error: {
            main: '#f44336',
            light: '#ef5350',
            dark: '#d32f2f',
        },
        currency: '#FFD700',
    },
};
