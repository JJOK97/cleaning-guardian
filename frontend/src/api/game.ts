import api from './index';

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
    try {
        const response = await api.post(`/stages/${stageIdx}/complete`, null, {
            params: { email, successYn },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
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
