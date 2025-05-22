import api from './index';

export interface MapDescription {
    summary: string;
    current_status: string;
    cause: string;
    health_impact: string;
    improvement: string;
    recommend_difficulty: string;
}

export interface MapData {
    mapIdx: number;
    gameIdx: number;
    mapTitle: string;
    mapDesc: string; // JSON string
    mapTheme: string;
    createdAt: string;
}

export interface MapResponse {
    map: MapData | null;
    maplist: MapData[];
    success: boolean;
    message: string;
    email: string;
}

export interface ProcessedMap {
    mapIdx: number;
    gameIdx: number;
    mapTitle: string;
    mapTheme: string;
    createdAt: string;
    mapDesc: MapDescription;
    unlocked: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ClearedMapsResponse {
    success: boolean;
    message: string;
    email: string;
    map: null;
    maplist: MapData[];
}

export interface MapModalData {
    mapTitle: string;
    mapDesc: MapDescription;
}

export interface Map {
    map_idx: number;
    game_idx: number;
    map_title: string;
    map_desc: MapDescription;
    map_theme: string;
    created_at: string;
    unlocked?: boolean;
}

// 맵 목록 조회
export const getMaps = async (): Promise<MapResponse> => {
    try {
        const response = await api.get('/maps');
        return response.data;
    } catch (error) {
        console.error('맵 목록 조회 실패:', error);
        throw error;
    }
};

// 클리어한 맵 목록 조회
export const getClearedMaps = async (email: string): Promise<MapResponse> => {
    try {
        const response = await api.get('/maps/clear', {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('클리어한 맵 목록 조회 실패:', error);
        throw error;
    }
};

// 맵 상세 조회
export const getMapDetail = async (mapIdx: number): Promise<MapResponse> => {
    try {
        const response = await api.get(`/maps/${mapIdx}`);
        return response.data;
    } catch (error) {
        console.error('맵 상세 조회 실패:', error);
        throw error;
    }
};

// 스테이지 목록 조회
export const getMapStages = async (mapIdx: number) => {
    try {
        const response = await api.get(`/maps/${mapIdx}/stages`);
        return response.data;
    } catch (error) {
        console.error('스테이지 목록 조회 실패:', error);
        throw error;
    }
};

// 클리어한 스테이지 조회
export const getClearedStages = async (mapIdx: number, email: string) => {
    try {
        const response = await api.get(`/maps/${mapIdx}/stages/clear`, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('클리어한 스테이지 조회 실패:', error);
        throw error;
    }
};

// 맵 테마별 이미지 매핑
export const mapThemeImages: Record<string, string> = {
    ocean: '/src/assets/img/map/trash-island.png',
    metal: '/src/assets/img/map/metal-land.png',
    city: '/src/assets/img/map/smoge-factory.png',
};
