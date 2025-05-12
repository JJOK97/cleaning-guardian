import { colors } from '../../colors';

export const layoutStyles = {
    mainLayout: {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column' as const,
            backgroundColor: colors.background.main,
        },
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            padding: '1rem',
            paddingBottom: 'calc(1rem + 60px)', // Footer 높이만큼 패딩 추가
            boxSizing: 'border-box' as const,
            overflowY: 'auto' as const,
        },
    },
    header: {
        container: {
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background.card,
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${colors.border.light}`,
        },
        stageInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        },
        stageBadge: {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: `1px solid rgba(76, 175, 80, 0.3)`,
        },
        resources: {
            display: 'flex',
            gap: '1rem',
        },
        resourceBadge: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
        },
        coinBadge: {
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
        },
        gemBadge: {
            backgroundColor: 'rgba(147, 112, 219, 0.2)',
            border: '1px solid rgba(147, 112, 219, 0.3)',
        },
    },
    footer: {
        container: {
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: colors.background.card,
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${colors.border.light}`,
            position: 'fixed' as const,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        },
        button: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            color: colors.text.primary,
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            transition: 'all 0.2s',
            width: '60px',
        },
        activeButton: {
            color: colors.primary.main,
        },
        icon: {
            fontSize: '1.5rem',
        },
        label: {
            fontSize: '0.8rem',
        },
    },
} as const;
