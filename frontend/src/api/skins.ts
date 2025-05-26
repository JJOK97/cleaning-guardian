import api from './index';

export interface SkinData {
    skinIdx: number;
    gameIdx: number;
    skinName: string;
    skinDesc: string;
    skinImg: string;
    skinPrice: number;
    actionType: string;
    createdAt: string;
}

export interface UserSkinData {
    uskinIdx: number;
    email: string;
    skinIdx: number;
    getType: string;
    createdAt: string;
    isEquipped: string;
    skin: {
        skinIdx: number;
        gameIdx: number;
        skinName: string;
        skinDesc: string;
        skinImg: string;
        skinPrice: number;
        actionType: string;
        createdAt: string;
    };
}

export interface SkinsResponse {
    success: boolean;
    message: string;
    userSkinList?: UserSkinData[];
}

// 현재 장착된 슬라이스 스킨 조회
export const getEquippedSliceSkin = async (email: string): Promise<UserSkinData | null> => {
    try {
        const response = await api.get('/skins/slice/equipped', {
            params: { email },
        });
        return response.data || null;
    } catch (error) {
        console.error('getEquippedSliceSkin error:', error);
        throw error;
    }
};

// 현재 장착된 탭 스킨 조회
export const getEquippedTapSkin = async (email: string): Promise<UserSkinData | null> => {
    try {
        const response = await api.get('/skins/tap/equipped', {
            params: { email },
        });
        return response.data || null;
    } catch (error) {
        console.error('getEquippedTapSkin error:', error);
        throw error;
    }
};

// 보유한 슬라이스 스킨 목록 조회
export const getUserSliceSkins = async (email: string): Promise<UserSkinData[]> => {
    try {
        const response = await api.get('/skins/slice/user', {
            params: { email },
        });
        const result = response.data || [];
        return result;
    } catch (error) {
        console.error('getUserSliceSkins error:', error);
        throw error;
    }
};

// 보유한 탭 스킨 목록 조회
export const getUserTapSkins = async (email: string): Promise<UserSkinData[]> => {
    try {
        const response = await api.get('/skins/tap/user', {
            params: { email },
        });
        const result = response.data || [];
        return result;
    } catch (error) {
        console.error('getUserTapSkins error:', error);
        throw error;
    }
};

// 탭 스킨 장착
export const equipTapSkin = async (email: string, skinIdx: number): Promise<string> => {
    try {
        const response = await api.post(`/skins/tap/equip/${skinIdx}`, null, {
            params: { email },
            responseType: 'text',
        });
        return response.data;
    } catch (error) {
        console.error('equipTapSkin 에러:', error);
        throw error;
    }
};

// 탭 스킨 해제
export const unequipTapSkin = async (email: string, skinIdx: number): Promise<string> => {
    try {
        const response = await api.post(`/skins/tap/unequip/${skinIdx}`, null, {
            params: { email },
            responseType: 'text',
        });
        return response.data;
    } catch (error) {
        console.error('unequipTapSkin 에러:', error);
        throw error;
    }
};

// 스킨 구매
export const purchaseSkin = async (email: string, skinIdx: number): Promise<SkinData> => {
    try {
        const response = await api.post(`/skins/purchase/${skinIdx}`, null, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 전체 슬라이스 스킨 목록 조회
export const getAllSliceSkins = async (email: string): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/skins/slice', {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getAllSliceSkins error:', error);
        throw error;
    }
};

// 전체 탭 스킨 목록 조회
export const getAllTapSkins = async (email: string): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/skins/tap', {
            headers: { email },
        });
        return response.data;
    } catch (error) {
        console.error('getAllTapSkins error:', error);
        throw error;
    }
};

// 슬라이스 스킨 장착
export const equipSliceSkin = async (email: string, skinIdx: number): Promise<string> => {
    try {
        const response = await api.post(`/skins/slice/equip/${skinIdx}?email=${email}`);
        return response.data;
    } catch (error) {
        console.error('슬라이스 스킨 장착 실패:', error);
        throw error;
    }
};

// 슬라이스 스킨 해제
export const unequipSliceSkin = async (email: string, skinIdx: number): Promise<string> => {
    try {
        const response = await api.post(`/skins/slice/unequip/${skinIdx}?email=${email}`);
        return response.data;
    } catch (error) {
        console.error('슬라이스 스킨 해제 실패:', error);
        throw error;
    }
};
