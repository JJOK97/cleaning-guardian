import { colors } from './colors';

export const commonStyles = {
    fullScreen: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.main,
    },
    button: {
        primary: {
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: colors.primary.main,
            color: colors.text.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: colors.shadow,
        },
        secondary: {
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: colors.primary.light,
            color: colors.text.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: colors.shadow,
        },
    },
    title: {
        color: colors.text.primary,
        fontSize: '2rem',
        fontWeight: 'bold',
    },
} as const;
