import api from './index';
import { Pollution, UserCollection, CollectionData } from '@/types/collection';

export interface CollectionResponse {
    data: CollectionData;
}

// 전체 오염물질 목록 조회
export const getAllPollutions = async () => {
    try {
        const response = await api.get<CollectionResponse>('/collections');
        return response.data;
    } catch (error) {
        console.error('오염물질 목록 조회 실패:', error);
        throw error;
    }
};

// 사용자별 수집 목록 조회
export const getUserCollections = async (email: string) => {
    try {
        const response = await api.get<CollectionResponse>(`/collections/user/${email}`);
        return response.data;
    } catch (error) {
        console.error('사용자 컬렉션 조회 실패:', error);
        throw error;
    }
};

// 오염물질 상세 정보 조회
export const getPollutionDetail = async (polIdx: number) => {
    try {
        const response = await api.get<CollectionResponse>(`/collections/${polIdx}`);
        return response.data;
    } catch (error) {
        console.error('오염물질 상세 정보 조회 실패:', error);
        throw error;
    }
};

// 도감 완성도 조회
export const getCollectionCompletion = async (email: string) => {
    try {
        const response = await api.get<CollectionResponse>(`/collections/completion/${email}`);
        return response.data;
    } catch (error) {
        console.error('컬렉션 완료율 조회 실패:', error);
        throw error;
    }
};

// 오염물질 수집 처리
export const collectPollution = async (email: string, polIdx: number) => {
    try {
        const response = await api.post<CollectionResponse>('/collections/collect', {
            email,
            polIdx,
        });
        return response.data;
    } catch (error) {
        console.error('오염물질 수집 실패:', error);
        throw error;
    }
};
