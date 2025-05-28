export interface Pollution {
    polIdx: number;
    polName: string;
    polDesc: string;
    polImg1: string;
    polImg2: string;
    polImg3: string;
    type: string;
    count: number;
    collectionCount: number;
    collected?: boolean;
    totalScore?: number;
    maxCombo?: number;
}

export interface UserCollection {
    collectionIdx: number;
    email: string;
    polIdx: number;
    polName: string;
    polImg1: string;
    type: string;
    collectedAt: string;
}

export interface CollectionData {
    pollutions: Pollution[];
    totalCount: number;
    collectedCount: number;
    completionRate: number;
    userCollections: Pollution[] | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}
