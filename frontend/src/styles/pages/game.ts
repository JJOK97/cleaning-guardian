import { colors } from '../colors';

export const gameStyles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        backgroundColor: colors.background.main,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    score: {
        position: 'absolute' as const,
        top: 'clamp(0.5rem, 2vw, 1rem)',
        left: 'clamp(0.5rem, 2vw, 1rem)',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem)',
        borderRadius: '4px',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: colors.text.primary,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    stage: {
        width: '100%',
        height: '100%',
        touchAction: 'none' as const,
    },
    result: {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            boxSizing: 'border-box' as const,
        },
        card: {
            background: colors.background.card,
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '1.5rem',
            maxWidth: '500px',
            width: '100%',
        },
        title: {
            color: colors.text.primary,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            margin: 0,
        },
        stars: {
            display: 'flex',
            gap: '0.5rem',
        },
        star: {
            fontSize: '2rem',
            color: colors.currency.coin,
        },
        starDisabled: {
            color: 'rgba(255, 255, 255, 0.2)',
        },
        score: {
            color: colors.text.primary,
            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
        },
        buttons: {
            display: 'flex',
            gap: '1rem',
            width: '100%',
        },
        button: {
            flex: 1,
            padding: '1rem',
            background: colors.background.card,
            border: `1px solid ${colors.border.medium}`,
            borderRadius: '10px',
            color: colors.text.primary,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        buttonHover: {
            background: colors.background.light,
        },
        primaryButton: {
            background: colors.primary.main,
            border: 'none',
        },
        primaryButtonHover: {
            background: colors.primary.dark,
        },
    },
} as const;
