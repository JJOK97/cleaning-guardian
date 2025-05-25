import api from './index';
import { Reward } from '@/types/reward';

export interface UserPlayResponse {
    success: boolean;
    message: string;
    email: string;
    stageIdx: number;
}

export interface GameClearResponse {
    success: boolean;
    message: string;
    email: string;
    stageIdx: number;
    successYn: string;
}

export interface GameItem {
    itemIdx: number;
    itemName: string;
    itemDesc: string;
    itemImg: string;
    itemPrice: number;
    itemType: string; // 'TIME' | 'LIFE' | 'SCORE'
    createdAt: string;
}

export interface UserItem {
    uitemIdx: number;
    email: string;
    itemIdx: number;
    getType: string;
    createdAt: string;
    item: GameItem;
}

export interface GameItemsResponse {
    success: boolean;
    message: string;
    item?: GameItem;
    itemlist?: GameItem[];
    uitem?: UserItem;
    uitemlist?: UserItem[];
}

export interface UserItemDTO {
    success: boolean;
    message: string;
    email: string;
    uitemIdx: number;
    itemIdx: number;
    getType: string;
    createdAt: string;
    item: GameItem;
}

export interface RewardDTO {
    success: boolean;
    message: string;
    point: number;
    cash: number;
}

// 게임 시작
export const startGame = async (email: string, stageIdx: number): Promise<UserPlayResponse> => {
    try {
        const response = await api.post('/user-plays', null, {
            params: { email, stageIdx },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 게임 클리어
export const completeGame = async (stageIdx: number, email: string, successYn: string): Promise<GameClearResponse> => {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await api.post(`/stages/${stageIdx}/complete`, null, {
                params: { email, successYn },
            });
            return response.data;
        } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
                console.error('게임 클리어 처리 실패:', error);
                throw error;
            }
            // 재시도 전 잠시 대기
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        }
    }

    throw new Error('최대 재시도 횟수 초과');
};

// 스테이지 오염물질 정보 조회
export const getStagePollutions = async (stageIdx: number) => {
    try {
        const response = await api.get(`/user-plays/${stageIdx}/pollutions`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 사용자 보유 아이템 목록 조회
export const getUserItems = async (email: string): Promise<GameItemsResponse> => {
    try {
        const response = await api.get('/items/user', {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 아이템 사용
export const useItem = async (email: string, itemIdx: number): Promise<GameItemsResponse> => {
    try {
        const response = await api.post(`/items/use/${itemIdx}`, null, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 아이템 장착
export const equipItem = async (email: string, itemIdx: number, slot: number): Promise<UserItemDTO> => {
    const res = await api.post(`/items/equip/${itemIdx}?slot=${slot}`, null, {
        headers: {
            email: email,
        },
    });
    return res.data;
};

// 아이템 해제
export const unequipItem = async (email: string, itemIdx: number): Promise<UserItemDTO> => {
    const res = await api.post(`/items/unequip/${itemIdx}`, null, {
        headers: {
            email: email,
        },
    });
    return res.data;
};

// 장착된 아이템 목록 조회
export const getEquippedItems = async (email: string): Promise<UserItemDTO> => {
    const res = await api.get('/items/equipped', {
        headers: {
            email: email,
        },
    });
    return res.data;
};

// 포인트 보상 수령
export const postPointReward = async (email: string, value: number): Promise<RewardDTO> => {
    try {
        const response = await api.patch('/reward/point', null, {
            params: { email, value },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 캐시 보상 수령
export const postCashReward = async (email: string, value: number): Promise<RewardDTO> => {
    try {
        const response = await api.patch('/reward/cash', null, {
            params: { email, value },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postReward = async (email: string, rewards: Reward[]) => {
    console.log('Posting reward:', { email, rewards });
    try {
        const response = await api.post('/reward', rewards, {
            params: { email },
        });
        console.log('Reward response:', response.data);
        return response;
    } catch (error) {
        console.error('Reward error:', error);
        throw error;
    }
};
