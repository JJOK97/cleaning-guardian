import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
    colors: {
        background: {
            main: '#F5F7FA',
            light: '#FFFFFF',
            dark: '#E4E7EB',
            card: '#FFFFFF',
            overlay: 'rgba(0, 0, 0, 0.5)',
            disabled: '#F0F0F0',
        },
        text: {
            primary: '#2D3748',
            secondary: '#718096',
            disabled: '#A0AEC0',
        },
        primary: {
            main: '#4A90E2',
            light: '#64A6E8',
            dark: '#357ABD',
        },
        error: {
            main: '#F56565',
            light: '#FC8181',
            dark: '#C53030',
        },
        success: {
            main: '#48BB78',
            light: '#68D391',
            dark: '#2F855A',
        },
        warning: {
            main: '#ECC94B',
            light: '#F6E05E',
            dark: '#B7791F',
        },
        currency: '#FFD700',
    },
};
