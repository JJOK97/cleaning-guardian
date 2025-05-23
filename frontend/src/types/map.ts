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
    mapTheme: string;
    createdAt: string;
    mapDesc: string;
}

export interface ProcessedMap extends Omit<MapData, 'mapDesc'> {
    map_desc: string;
    mapDesc: MapDescription;
    unlocked: boolean;
}

export interface MapResponse {
    success: boolean;
    message: string;
    map: MapData | null;
    maplist: MapData[];
    email: string;
}

export interface StageMission {
    mission: string;
}

export interface ProcessedStageInfo {
    stageIdx: number;
    stageName: string;
    stageMission: StageMission;
    isFinalStage: 'Y' | 'N';
    unlocked: boolean;
}
