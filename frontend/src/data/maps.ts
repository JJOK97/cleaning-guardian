export interface Map {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    rewards: {
        coins: number;
        experience: number;
    };
}

export const maps: Map[] = [
    {
        id: 'ocean',
        name: '바다',
        description: '플라스틱으로 오염된 바다를 정화하세요',
        icon: '🌊',
        unlocked: true,
        difficulty: 'easy',
        rewards: {
            coins: 100,
            experience: 50,
        },
    },
    {
        id: 'forest',
        name: '숲',
        description: '쓰레기로 오염된 숲을 정화하세요',
        icon: '🌲',
        unlocked: false,
        difficulty: 'medium',
        rewards: {
            coins: 200,
            experience: 100,
        },
    },
    {
        id: 'city',
        name: '도시',
        description: '미세먼지로 오염된 도시를 정화하세요',
        icon: '🏙️',
        unlocked: false,
        difficulty: 'hard',
        rewards: {
            coins: 300,
            experience: 150,
        },
    },
];
