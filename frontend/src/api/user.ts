import api from './index';

export const getUserInfo = async () => {
    const res = await api.get('/users/me');
    console.log('[getUserInfo] response:', res.data);
    return res.data;
};

export const getUserBalance = async () => {
    const res = await api.get('/users/me/balance');
    console.log('[getUserBalance] response:', res.data);
    return res.data;
};
