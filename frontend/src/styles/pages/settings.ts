import { colors } from '../colors';

export const settingsStyles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
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
        gap: '2rem',
        maxWidth: '500px',
        width: '100%',
    },
    title: {
        color: colors.text.primary,
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        margin: 0,
        textAlign: 'center' as const,
    },
    settings: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem',
    },
    setting: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        color: colors.text.primary,
        fontSize: '1.1rem',
    },
    toggleButton: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '8px',
        color: colors.text.primary,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    toggleButtonOn: {
        background: colors.status.success,
    },
    toggleButtonOff: {
        background: colors.status.error,
    },
    volumeControl: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
    },
    volumeSlider: {
        width: '100%',
        height: '4px',
        background: colors.primary.main,
        borderRadius: '2px',
        outline: 'none',
        WebkitAppearance: 'none' as const,
    },
} as const;
