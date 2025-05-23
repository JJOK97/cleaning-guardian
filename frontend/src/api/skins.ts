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
    skinName: string;
    skinImg: string;
    skinType: 'S' | 'T';
    isEquipped: boolean;
}

export interface SkinsResponse {
    success: boolean;
    message: string;
    skin?: SkinData;
    skinlist?: SkinData[];
    uskin?: UserSkinData;
    uskinlist?: UserSkinData[];
}

// 현재 장착된 전체 스킨 조회
export const getEquippedSkins = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/api/v1/skins/equipped');
        return response.data;
    } catch (error) {
        console.error('장착된 스킨 조회 실패:', error);
        throw error;
    }
};

// 현재 장착된 슬라이스 스킨 조회
export const getEquippedSliceSkin = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/api/v1/skins/slice/equipped');
        return response.data;
    } catch (error) {
        console.error('장착된 슬라이스 스킨 조회 실패:', error);
        throw error;
    }
};

// 현재 장착된 탭 스킨 조회
export const getEquippedTapSkin = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/api/v1/skins/tap/equipped');
        return response.data;
    } catch (error) {
        console.error('장착된 탭 스킨 조회 실패:', error);
        throw error;
    }
};

// 보유한 슬라이스 스킨 목록 조회
export const getUserSliceSkins = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/api/v1/skins/slice/user');
        return response.data;
    } catch (error) {
        console.error('보유한 슬라이스 스킨 조회 실패:', error);
        throw error;
    }
};

// 보유한 탭 스킨 목록 조회
export const getUserTapSkins = async (): Promise<SkinsResponse> => {
    try {
        const response = await api.get('/api/v1/skins/tap/user');
        return response.data;
    } catch (error) {
        console.error('보유한 탭 스킨 조회 실패:', error);
        throw error;
    }
};
