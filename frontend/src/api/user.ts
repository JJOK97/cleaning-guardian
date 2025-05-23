import api from './index';

export const getUserInfo = async () => {
    const res = await api.get('/users/me');
    return res.data;
};

export const getUserBalance = async () => {
    const res = await api.get('/users/me/balance');
    return res.data;
};
