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
                setUser(response);
            } catch (error) {
                console.error('사용자 정보 로딩 실패:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};
