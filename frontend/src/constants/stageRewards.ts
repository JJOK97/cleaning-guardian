import { Reward } from '@/types/reward';

export const stageRewards: Record<number, Reward[]> = {
    // 1. 녹조해변
    1: [
        { type: 'POINT', value: 100 },
        { type: 'CASH', value: 10 },
        { type: 'ITEM', value: 2, itemIdx: 1, itemName: '헌 수건', itemImg: 'recycled_towel' },
        { type: 'ITEM', value: 2, itemIdx: 3, itemName: '방역 장갑', itemImg: 'safety_gloves' },
    ],
    // 2. 병목수로
    2: [
        { type: 'POINT', value: 120 },
        { type: 'CASH', value: 12 },
        { type: 'ITEM', value: 2, itemIdx: 2, itemName: '고급 정화제', itemImg: 'eco_cleaner' },
        { type: 'ITEM', value: 3, itemIdx: 8, itemName: '정화 빗자루', itemImg: 'eco_broom' },
    ],
    // 3. 검은 녹조의 만
    3: [
        { type: 'POINT', value: 150 },
        { type: 'CASH', value: 15 },
        { type: 'ITEM', value: 2, itemIdx: 34, itemName: '정화제', itemImg: 'purifying_agent' },
        { type: 'ITEM', value: 2, itemIdx: 4, itemName: '방역 마스크', itemImg: 'safety_mask' },
    ],
    // 4. 공사장
    4: [
        { type: 'POINT', value: 180 },
        { type: 'CASH', value: 18 },
        { type: 'ITEM', value: 3, itemIdx: 55, itemName: '생분해성 미끼통', itemImg: 'biodegradable_bait' },
        { type: 'ITEM', value: 2, itemIdx: 56, itemName: '슬러지 중화제', itemImg: 'sludge_neutralizer' },
    ],
    // 5. 농약 밭
    5: [
        { type: 'POINT', value: 200 },
        { type: 'CASH', value: 20 },
        { type: 'ITEM', value: 2, itemIdx: 58, itemName: '토양 정화제', itemImg: 'soil_purifier' },
        { type: 'ITEM', value: 3, itemIdx: 57, itemName: '정화 삽', itemImg: 'purifying_shovel' },
    ],
    // 6. 폐광산
    6: [
        { type: 'POINT', value: 220 },
        { type: 'CASH', value: 22 },
        { type: 'ITEM', value: 2, itemIdx: 59, itemName: '정화탄', itemImg: 'purifying_charcoal' },
        { type: 'ITEM', value: 2, itemIdx: 1, itemName: '헌 수건', itemImg: 'recycled_towel' },
    ],
    // 7. 매연 도시
    7: [
        { type: 'POINT', value: 250 },
        { type: 'CASH', value: 25 },
        { type: 'ITEM', value: 3, itemIdx: 2, itemName: '고급 정화제', itemImg: 'eco_cleaner' },
        { type: 'ITEM', value: 2, itemIdx: 3, itemName: '방역 장갑', itemImg: 'safety_gloves' },
    ],
    // 8. 먼지 대로
    8: [
        { type: 'POINT', value: 270 },
        { type: 'CASH', value: 27 },
        { type: 'ITEM', value: 2, itemIdx: 4, itemName: '방역 마스크', itemImg: 'safety_mask' },
        { type: 'ITEM', value: 3, itemIdx: 34, itemName: '정화제', itemImg: 'purifying_agent' },
    ],
    // 9. 심장부
    9: [
        { type: 'POINT', value: 300 },
        { type: 'CASH', value: 30 },
        { type: 'ITEM', value: 2, itemIdx: 8, itemName: '정화 빗자루', itemImg: 'eco_broom' },
        { type: 'ITEM', value: 3, itemIdx: 55, itemName: '생분해성 미끼통', itemImg: 'biodegradable_bait' },
        { type: 'ITEM', value: 2, itemIdx: 59, itemName: '정화탄', itemImg: 'purifying_charcoal' },
    ],
};
