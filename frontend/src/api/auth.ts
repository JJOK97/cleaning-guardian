import api from './index';

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
