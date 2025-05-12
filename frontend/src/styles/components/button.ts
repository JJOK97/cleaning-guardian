import { colors } from '../colors';

export const buttonStyles = {
    base: {
        padding: '0.75rem 1.5rem',
        fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    variants: {
        primary: {
            backgroundColor: colors.primary.main,
            color: colors.text.primary,
            boxShadow: colors.shadow.small,
            '&:hover': {
                backgroundColor: colors.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: colors.shadow.medium,
            },
        },
        secondary: {
            backgroundColor: colors.background.card,
            color: colors.text.primary,
            border: `1px solid ${colors.border.medium}`,
            '&:hover': {
                backgroundColor: colors.background.light,
                transform: 'translateY(-2px)',
            },
        },
        icon: {
            padding: '0.5rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            color: colors.text.primary,
            '&:hover': {
                backgroundColor: colors.background.card,
            },
        },
        nav: {
            background: 'none',
            color: '#fff',
            padding: '0.5rem',
            borderRadius: '8px',
            width: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
        },
        navActive: {
            color: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
        },
    },
    sizes: {
        small: {
            padding: '0.5rem 1rem',
            fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        },
        medium: {
            padding: '0.75rem 1.5rem',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
        },
        large: {
            padding: '1rem 2rem',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        },
    },
} as const;
