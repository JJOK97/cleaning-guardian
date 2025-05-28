import api from './index';

export interface Quiz {
    quizIdx: number;
    quizDesc: string;
    quizAnswer: 'O' | 'X';
}

export interface QuizResponse {
    quiz: Quiz;
    message: string;
    success: boolean;
}

export const getRandomQuiz = async (): Promise<QuizResponse> => {
    try {
        const response = await api.get<QuizResponse>('/quizzes');
        return response.data;
    } catch (error) {
        console.error('퀴즈 조회 실패:', error);
        throw error;
    }
};
