export interface Reward {
    type: 'POINT' | 'CASH' | 'ITEM';
    value: number;
    itemIdx?: number;
    itemName?: string;
    itemImg?: string;
}
