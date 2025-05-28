import { useState, useEffect } from 'react';
import { getUserInfo } from '@/api/user';

interface User {
    email: string;
    nickname: string;
}

interface UserInfoResponse {
    success: boolean;
    email: string;
    nickname: string;
    message?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 토큰 존재 여부 먼저 확인
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('토큰이 없습니다.');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const response = (await getUserInfo()) as UserInfoResponse;

                // API 응답 구조 확인
                if (response && response.success && response.email) {
                    setUser({
                        email: response.email,
                        nickname: response.nickname,
                    });
                    console.log('사용자 정보 로딩 성공:', response.email);
                } else {
                    console.log('사용자 정보 응답이 올바르지 않습니다:', response);
                    setUser(null);
                    // 잘못된 토큰인 경우 제거
                    localStorage.removeItem('accessToken');
                }
            } catch (error) {
                console.error('사용자 정보 로딩 실패:', error);
                setUser(null);

                // 401 에러인 경우 토큰 제거
                if ((error as any)?.response?.status === 401) {
                    console.log('토큰이 만료되었습니다. 토큰을 제거합니다.');
                    localStorage.removeItem('accessToken');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};
