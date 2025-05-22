export const mainLayoutStyles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    main: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '1rem',
        paddingBottom: '80px', // Footer 높이만큼 여백 추가
    },
} as const;
