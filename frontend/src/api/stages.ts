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
