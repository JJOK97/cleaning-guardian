import trashIslandImg from '@/assets/img/map/trash-island.png';
import smogeFactoryImg from '@/assets/img/map/smoge-factory.png';
import metalLandImg from '@/assets/img/map/metal-land.png';

export const getMapImage = (theme: string) => {
    switch (theme) {
        case 'ocean':
            return trashIslandImg;
        case 'metal':
            return metalLandImg;
        case 'city':
            return smogeFactoryImg;
        default:
            return trashIslandImg;
    }
};

export const getMapTitle = (theme: string) => {
    switch (theme) {
        case 'ocean':
            return '쓰레기 바다';
        case 'metal':
            return '금속 벌판';
        case 'city':
            return '스모그 시티';
        default:
            return '알 수 없는 맵';
    }
};
