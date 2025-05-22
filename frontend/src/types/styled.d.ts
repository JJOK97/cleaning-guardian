import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: {
                main: string;
                light: string;
                dark: string;
                card: string;
                overlay: string;
                disabled: string;
            };
            text: {
                primary: string;
                secondary: string;
                disabled: string;
            };
            primary: {
                main: string;
                light: string;
                dark: string;
            };
            error: {
                main: string;
                light: string;
                dark: string;
            };
            success: {
                main: string;
                light: string;
                dark: string;
            };
            warning: {
                main: string;
                light: string;
                dark: string;
            };
            currency: string;
        };
    }
}
