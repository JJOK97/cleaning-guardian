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
        color: colors.text.primary,
    },
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '1rem',
        boxSizing: 'border-box' as const,
    },
    card: {
        background: colors.background.card,
        borderRadius: '12px',
        padding: '1.5rem',
        border: `1px solid ${colors.border.medium}`,
        backdropFilter: 'blur(10px)',
    },
    button: {
        primary: {
            padding: '0.75rem 1.5rem',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            backgroundColor: colors.primary.main,
            color: colors.text.primary,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: colors.shadow.small,
            '&:hover': {
                backgroundColor: colors.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: colors.shadow.medium,
            },
        },
        secondary: {
            padding: '0.75rem 1.5rem',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            backgroundColor: colors.background.card,
            color: colors.text.primary,
            border: `1px solid ${colors.border.medium}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: colors.background.light,
                transform: 'translateY(-2px)',
            },
        },
    },
    title: {
        color: colors.text.primary,
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 'bold',
        margin: 0,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        margin: 0,
    },
    text: {
        color: colors.text.primary,
        fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
        margin: 0,
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gap: '1rem',
        width: '100%',
    },
} as const;
