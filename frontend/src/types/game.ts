export interface PollutantData {
    id: number;
    x: number;
    y: number;
    radius: number;
    color: string;
    isRemoved: boolean;
}

export interface StageData {
    id: number;
    name: string;
    difficulty: '쉬움' | '보통' | '어려움';
    pollutantCount: number;
    timeLimit?: number;
}

export interface GameResult {
    score: number;
    stageId: number;
    timeSpent: number;
    pollutantsRemoved: number;
    maxCombo: number;
}

export interface StageInfo {
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
