export const colors = {
    primary: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#2E7D32',
    },
    secondary: {
        main: '#9370DB',
        light: '#B19CD9',
        dark: '#6A5ACD',
    },
    background: {
        main: '#1a1a2e',
        light: '#16213e',
        dark: '#0B0B2B',
        overlay: 'rgba(0, 0, 0, 0.8)',
        card: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.8)',
        disabled: 'rgba(255, 255, 255, 0.4)',
    },
    border: {
        light: 'rgba(255, 255, 255, 0.1)',
        medium: 'rgba(255, 255, 255, 0.2)',
        dark: 'rgba(255, 255, 255, 0.3)',
    },
    status: {
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
    },
    currency: {
        coin: '#FFD700',
        gem: '#9370DB',
    },
    shadow: {
        small: '0 2px 4px rgba(0,0,0,0.2)',
        medium: '0 4px 8px rgba(0,0,0,0.3)',
        large: '0 8px 16px rgba(0,0,0,0.4)',
    },
} as const;
