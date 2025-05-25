export interface UserItem {
    userItemIdx: number;
    email: string;
    itemIdx: number;
    itemType: string;
    isUsed: string;
    count: number;
    createdAt: string;
    isEquipped: string;
    equippedSlot: number;
    item: {
        itemIdx: number;
        itemName: string;
        itemDesc: string;
        itemImg: string;
        itemPrice: number;
        priceType: string;
    };
}

export interface InventoryState {
    items: UserItem[];
    equippedItems: UserItem[];
    isLoading: boolean;
    error: string | null;
}
