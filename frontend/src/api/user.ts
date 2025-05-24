import api from './index';

export const getUserInfo = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await api.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getUserBalance = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await api.get('/users/me/balance', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
