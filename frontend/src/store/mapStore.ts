import { create } from 'zustand';
import { Map, MapState } from '@/types/map/map.types';

interface MapStore extends MapState {
    fetchMaps: () => Promise<void>;
    selectMap: (map: Map) => void;
    clearSelectedMap: () => void;
}

// 임시 데이터
const mockMaps: Map[] = [
    {
        map_idx: 1,
        game_idx: 1,
        map_title: '서울시',
        map_description: {
            summary: '서울시의 미세먼지 현황',
            current_status: "현재 서울시의 미세먼지 농도는 '나쁨' 수준입니다.",
            cause: '자동차 배기가스와 공장 매연이 주요 원인입니다.',
            health_impact: '호흡기 질환 위험이 증가합니다.',
            improvement: '대중교통 이용과 마스크 착용을 권장합니다.',
            recommended_difficulty: '중급',
        },
        map_theme: 'city',
        created_at: '2024-03-20',
    },
    {
        map_idx: 2,
        game_idx: 1,
        map_title: '부산시',
        map_description: {
            summary: '부산시의 미세먼지 현황',
            current_status: "현재 부산시의 미세먼지 농도는 '보통' 수준입니다.",
            cause: '선박 매연과 공장 매연이 주요 원인입니다.',
            health_impact: '민감한 사람들은 주의가 필요합니다.',
            improvement: '실내 환기를 자제하고 마스크를 착용하세요.',
            recommended_difficulty: '초급',
        },
        map_theme: 'port',
        created_at: '2024-03-20',
    },
];

export const useMapStore = create<MapStore>((set) => ({
    maps: [],
    selectedMap: null,
    isLoading: false,
    error: null,

    fetchMaps: async () => {
        try {
            set({ isLoading: true, error: null });

            // API 호출 대신 임시 데이터 사용
            // const response = await fetch('/api/v1/maps');
            // const data = await response.json();

            // 임시 데이터 사용
            set({
                maps: mockMaps,
                isLoading: false,
            });
        } catch (error) {
            console.error('맵 목록 조회 실패:', error);
            set({
                error: '맵 목록을 불러오는데 실패했습니다.',
                isLoading: false,
                maps: [],
            });
        }
    },

    selectMap: (map: Map) => {
        set({ selectedMap: map });
    },

    clearSelectedMap: () => {
        set({ selectedMap: null });
    },
}));
