import api from './index';

export interface PollutionData {
    polIdx: number;
    gameIdx: number;
    polName: string;
    polDesc: string;
    polImg1: string;
    polImg2: string;
    polImg3: string;
    type: string;
    createdAt: string;
}

export interface StagePollutionsResponse {
    success: boolean;
    message: string;
    pollution?: PollutionData;
    pollutions?: PollutionData[];
    pollutionsList?: PollutionData[];
}

export interface StageClearInfo {
    isFinalStage: string;
    mapIdx: number;
    clearedStagesCount: number;
    totalStagesCount: number;
}

export interface StageClearResponse {
    success: boolean;
    message: string;
    clearInfo?: StageClearInfo;
}

export interface Stage {
    stageIdx: number;
    mapIdx: number;
    stageTitle: string;
    stageDesc: string;
    stageTheme: string;
    createdAt: string;
}

export interface StageResponse {
    success: boolean;
    message: string;
    stages?: Stage[];
}

// 스테이지 오염물 정보 조회
export const getStagePollutions = async (stageIdx: number): Promise<StagePollutionsResponse> => {
    try {
        const response = await api.get(`/user-plays/${stageIdx}/pollutions`);
        return response.data;
    } catch (error) {
        console.error('스테이지 오염물 정보 조회 실패:', error);
        throw error;
    }
};

// 스테이지 클리어 정보 조회
export const checkStageClear = async (stageIdx: number, email: string): Promise<StageClearResponse> => {
    try {
        const response = await api.get(`/stages/${stageIdx}/clear-check`, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('스테이지 클리어 정보 조회 실패:', error);
        throw error;
    }
};

// 스테이지 목록 조회
export const getMapStages = async (mapIdx: number): Promise<StageResponse> => {
    try {
        const response = await api.get(`/stages/map/${mapIdx}`);
        return response.data;
    } catch (error) {
        console.error('스테이지 목록 조회 실패:', error);
        throw error;
    }
};

// 클리어한 스테이지 목록 조회
export const getClearedStages = async (mapIdx: number, email: string): Promise<StageResponse> => {
    try {
        const response = await api.get(`/stages/map/${mapIdx}/cleared`, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('클리어한 스테이지 목록 조회 실패:', error);
        throw error;
    }
};
