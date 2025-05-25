export interface Pollution {
    polIdx: number;
    gameIdx: number;
    polName: string;
    polDesc: string;
    polImg1: string;
    polImg2: string;
    polImg3: string;
    type: string;
    isCollected: boolean;
    collectionCount: number;
    createdAt: string;
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
    userCollections: UserCollection[];
}
