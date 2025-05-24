import api from './index';
import { UserPlayResponse } from './game';

export const login = async ({ email, password, deviceId }: { email: string; password: string; deviceId: string }) => {
    return api.post('/auth/login', { email, password, deviceId });
};

export const signup = async ({
    email,
    password,
    nickname,
    deviceId,
}: {
    email: string;
    password: string;
    nickname: string;
    deviceId: string;
}) => {
    return api.post('/auth/signup', { email, password, nickname, deviceId });
};

export const startGame = async (email: string, stageIdx: number): Promise<UserPlayResponse> => {
    try {
        const response = await api.post('/user-plays', null, {
            params: { email, stageIdx },
        });
        return response.data;
    } catch (error) {
        console.error('게임 시작 실패:', error);
        throw error;
    }
};
