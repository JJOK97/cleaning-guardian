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
