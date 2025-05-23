export interface MapDescription {
    summary: string;
    current_status: string;
    cause: string;
    health_impact: string;
    improvement: string;
    recommended_difficulty: string;
}

export interface Map {
    map_idx: number;
    game_idx: number;
    map_title: string;
    map_description: MapDescription;
    map_theme: string;
    created_at: string;
}

export interface MapState {
    maps: Map[];
    selectedMap: Map | null;
    isLoading: boolean;
    error: string | null;
}
