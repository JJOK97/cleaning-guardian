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
            secondary: {
                main: string;
                light: string;
                dark: string;
            };
            border: {
                light: string;
                medium: string;
                primary: string;
                disabled: string;
            };
            shadow: {
                light: string;
                medium: string;
                dark: string;
            };
            error: {
                main: string;
                light: string;
                dark: string;
            };
            currency: string;
        };
    }
}
