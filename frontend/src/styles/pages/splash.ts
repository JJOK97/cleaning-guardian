import { colors } from '../colors';

export const splashStyles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${colors.background.main} 0%, ${colors.background.light} 100%)`,
        color: colors.text.primary,
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        marginBottom: '1rem',
        animation: 'fadeIn 1s ease-in-out',
    },
    subtitle: {
        fontSize: 'clamp(1rem, 2vw, 1.5rem)',
        opacity: 0.8,
        animation: 'fadeIn 1s ease-in-out 0.5s both',
    },
    animations: {
        fadeIn: `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `,
    },
} as const;
