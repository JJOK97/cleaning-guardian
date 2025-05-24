import { useState, useEffect } from 'react';
import { getUserInfo } from '@/api/user';

interface User {
    email: string;
    nickname: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserInfo();
                console.log('getUserInfo 응답:', response);
                // response.data가 아닌 response 자체를 사용
                setUser(response);
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};
