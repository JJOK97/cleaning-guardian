import api from './index';
import { Reward } from '@/types/reward';
import { UserItem } from '@/types/inventory';

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

// 아이템 목록 조회
export const getUserItems = async (email: string) => {
    try {
        const response = await api.get(`/items/user`, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getUserItems 에러:', error);
        throw error;
    }
};

// 전체 아이템 목록 조회
export const getAllItems = async () => {
    try {
        const response = await api.get(`/items`);
        return response.data;
    } catch (error) {
        console.error('getAllItems 에러:', error);
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
export const equipItem = async (email: string, itemIdx: number, slot: number) => {
    try {
        const response = await api.post(`/items/equip/${itemIdx}`, null, {
            headers: { email },
            params: { slot },
        });
        return response.data;
    } catch (error) {
        console.error('equipItem 에러:', error);
        throw error;
    }
};

// 아이템 해제
export const unequipItem = async (email: string, itemIdx: number) => {
    try {
        const response = await api.post(`/items/unequip/${itemIdx}`, null, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('unequipItem 에러:', error);
        throw error;
    }
};

// 장착된 아이템 조회
export const getEquippedItems = async (email: string) => {
    try {
        const response = await api.get(`/items/equipped`, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getEquippedItems 에러:', error);
        throw error;
    }
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
    try {
        const response = await api.post('/reward', rewards, {
            params: { email },
        });
        return response;
    } catch (error) {
        console.error('Reward error:', error);
        throw error;
    }
};

// 스킨 목록 조회
export const getUserSkins = async (email: string) => {
    try {
        const response = await api.get(`/skins/user`, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getUserSkins 에러:', error);
        throw error;
    }
};

// 장착된 스킨 조회
export const getEquippedSkins = async (email: string) => {
    try {
        const response = await api.get(`/skins/equipped`, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getEquippedSkins 에러:', error);
        throw error;
    }
};

// 스킨 장착
export const equipSkin = async (email: string, skinIdx: number) => {
    try {
        const response = await api.post(`/skins/equip/${skinIdx}`, null, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('equipSkin 에러:', error);
        throw error;
    }
};

// 스킨 해제
export const unequipSkin = async (email: string, skinIdx: number) => {
    try {
        const response = await api.post(`/skins/unequip/${skinIdx}`, null, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('unequipSkin 에러:', error);
        throw error;
    }
};

// 아이템 구매
export const purchaseItem = async (email: string, itemIdx: number): Promise<GameItemsResponse> => {
    try {
        const response = await api.post(`/items/purchase/${itemIdx}`, null, {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ===== 게임 로직 개선: 새로운 API 함수들 =====

/**
 * 스테이지별 게임 설정 조회
 */
export const getStageConfig = async (stageIdx: number) => {
    try {
        const response = await api.get(`/stages/${stageIdx}/config`);
        return response.data;
    } catch (error) {
        console.error('스테이지 설정 조회 실패:', error);
        throw error;
    }
};

/**
 * 게임 시작 시 아이템 효과 정보 조회
 */
export const getGameItemEffects = async (email: string) => {
    try {
        const response = await api.get('/items/effects/game-start', {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('아이템 효과 조회 실패:', error);
        throw error;
    }
};

/**
 * 게임 결과 저장 (처치한 오염물질 데이터)
 */
export const saveGameResult = async (email: string, gameResult: any) => {
    try {
        const response = await api.post('/game-results', gameResult, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('게임 결과 저장 실패:', error);
        throw error;
    }
};

/**
 * 사용자 수집 통계 조회
 */
export const getUserCollectionStats = async (email: string) => {
    try {
        const response = await api.get(`/users/${email}/collection-stats`);
        return response.data;
    } catch (error) {
        console.error('수집 통계 조회 실패:', error);
        throw error;
    }
};

/**
 * 게임 완료 후 통합 처리
 */
export const processGameCompletion = async (email: string, defeatedPollutants: any[]) => {
    try {
        const response = await api.post(`/users/${email}/game-completion`, defeatedPollutants);
        return response.data;
    } catch (error) {
        console.error('게임 완료 처리 실패:', error);
        throw error;
    }
};
