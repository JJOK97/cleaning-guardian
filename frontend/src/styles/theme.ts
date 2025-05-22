import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: {
                primary: string;
                secondary: string;
                card: string;
                cardLocked: string;
            };
            text: {
                primary: string;
                secondary: string;
            };
            success: string;
            warning: string;
            error: string;
        };
    }
}

export const theme: DefaultTheme = {
    colors: {
        background: {
            primary: '#F5F7FA',
            secondary: '#E4E7EB',
            card: '#FFFFFF',
            cardLocked: '#F0F0F0',
        },
        text: {
            primary: '#2D3748',
            secondary: '#718096',
        },
        success: '#48BB78',
        warning: '#ECC94B',
        error: '#F56565',
    },
};
