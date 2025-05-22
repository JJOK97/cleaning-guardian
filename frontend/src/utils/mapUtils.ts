import trashIslandImg from '@/assets/img/map/trash-island.png';
import smogeFactoryImg from '@/assets/img/map/smoge-factory.png';
import metalLandImg from '@/assets/img/map/metal-land.png';

export const getMapImage = (mapIdx: number) => {
    switch (mapIdx) {
        case 1:
            return trashIslandImg;
        case 2:
            return metalLandImg;
        case 3:
            return smogeFactoryImg;
        default:
            return trashIslandImg;
    }
};

export const getMapTitle = (mapIdx: number) => {
    switch (mapIdx) {
        case 1:
            return '쓰레기 바다';
        case 2:
            return '금속 벌판';
        case 3:
            return '스모그 시티';
        default:
            return '알 수 없는 맵';
    }
};
