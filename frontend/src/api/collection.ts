import axios from './index';
import { ApiResponse, CollectionData, Pollution } from '@/types/collection';

export const getAllPollutions = async (): Promise<ApiResponse<CollectionData>> => {
    try {
        const response = await axios.get<CollectionData>('/collections');
        console.log('전체 오염물질 목록 응답:', response.data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('전체 오염물질 목록 요청 실패:', error);
        return {
            success: false,
            data: {
                pollutions: [],
                totalCount: 0,
                collectedCount: 0,
                completionRate: 0,
                userCollections: null,
            },
        };
    }
};

export const getUserCollections = async (email: string): Promise<ApiResponse<CollectionData>> => {
    try {
        const response = await axios.get<CollectionData>(`/collections/user/${email}`);
        console.log('사용자 수집 목록 응답:', response.data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('사용자 수집 목록 요청 실패:', error);
        return {
            success: false,
            data: {
                pollutions: [],
                totalCount: 0,
                collectedCount: 0,
                completionRate: 0,
                userCollections: null,
            },
        };
    }
};

export const getPollutionDetail = async (polIdx: number): Promise<ApiResponse<Pollution>> => {
    try {
        const response = await axios.get<Pollution>(`/collections/${polIdx}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('오염물질 상세 정보 요청 실패:', error);
        return {
            success: false,
            data: {} as Pollution,
        };
    }
};

export const getCollectionCompletion = async (email: string) => {
    console.log('수집 완료율 요청:', email);
    try {
        const response = await axios.get<CollectionData>(`/collections/completion/${email}`);
        console.log('수집 완료율 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('수집 완료율 요청 실패:', error);
        throw error;
    }
};

export const collectPollution = async (email: string, polIdx: number): Promise<ApiResponse<boolean>> => {
    try {
        const response = await axios.post('/collections/collect', { email, polIdx });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('오염물질 수집 요청 실패:', error);
        return {
            success: false,
            data: false,
        };
    }
};
