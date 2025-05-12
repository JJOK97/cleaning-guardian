import { colors } from '../../colors';

export const gameStyles = {
    background: {
        container: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background.main,
            overflow: 'hidden',
        },
    },
    preparationModal: {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background.overlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        },
        container: {
            background: `linear-gradient(to bottom, ${colors.background.main}, ${colors.background.dark})`,
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            border: `1px solid ${colors.border.light}`,
        },
        title: {
            color: colors.text.primary,
            marginTop: 0,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        },
        description: {
            color: colors.text.secondary,
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
        },
        itemGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
        },
        itemCard: {
            background: colors.background.card,
            border: `1px solid ${colors.border.medium}`,
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        selectedItemCard: {
            background: 'rgba(76, 175, 80, 0.2)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
        },
        itemIcon: {
            fontSize: '2rem',
        },
        itemName: {
            color: colors.text.primary,
            margin: 0,
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
        },
        itemDescription: {
            color: colors.text.secondary,
            fontSize: '0.9rem',
            textAlign: 'center' as const,
            margin: 0,
        },
        buttonContainer: {
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
        },
    },
    pollutant: {
        container: {
            position: 'relative' as const,
        },
        shadow: {
            fill: 'rgba(0,0,0,0.2)',
            offsetX: 5,
            offsetY: 5,
        },
        main: {
            stroke: colors.text.primary,
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.3,
            shadowOffset: { x: 2, y: 2 },
        },
        inner: {
            fill: 'rgba(255,255,255,0.1)',
            stroke: colors.text.primary,
            strokeWidth: 1,
        },
        highlight: {
            fill: colors.text.primary,
            opacity: 0.8,
        },
    },
    sliceTrail: {
        main: {
            lineCap: 'round' as const,
            lineJoin: 'round' as const,
            shadowBlur: 15,
            shadowOpacity: 0.8,
        },
        glow: {
            lineCap: 'round' as const,
            lineJoin: 'round' as const,
            opacity: 0.5,
        },
        particle: {
            fill: colors.text.primary,
            opacity: 0.6,
        },
    },
} as const;
