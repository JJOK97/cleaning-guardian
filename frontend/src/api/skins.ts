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
    skin?: SkinData;
    skinlist?: SkinData[];
    uskin?: UserSkinData;
    uskinlist?: UserSkinData[];
}

// 현재 장착된 슬라이스 스킨 조회
export const getEquippedSliceSkin = async (email: string): Promise<UserSkinData> => {
    const response = await api.get('/skins/slice/equipped', { params: { email } });
    return response.data;
};

// 현재 장착된 탭 스킨 조회
export const getEquippedTapSkin = async (email: string): Promise<UserSkinData> => {
    const response = await api.get('/skins/tap/equipped', { params: { email } });
    return response.data;
};

// 보유한 슬라이스 스킨 목록 조회
export const getUserSliceSkins = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/skins/slice/user');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 보유한 탭 스킨 목록 조회
export const getUserTapSkins = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/skins/tap/user');
        return response.data;
    } catch (error) {
        throw error;
    }
};
