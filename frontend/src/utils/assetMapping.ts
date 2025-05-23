// 오염물 이미지 import
import floatingTrash from '@/assets/img/pollution/floating_trash.png';
// import plasticBottle from '@/assets/img/pollution/plastic_bottle.png';
// import toxicSludge from '@/assets/img/pollution/toxic_sludge.png';
// import constructionWaste from '@/assets/img/pollution/construction_waste.png';
// import pesticideResidue from '@/assets/img/pollution/pesticide_residue.png';
// import heavyMetalSlug from '@/assets/img/pollution/heavy_metal_slug.png';
// import soot from '@/assets/img/pollution/soot.png';
// import ultrafineDust from '@/assets/img/pollution/ultrafine_dust.png';
// import dioxin from '@/assets/img/pollution/dioxin.png';
import pet from '@/assets/img/pollution/pet.png'; // 기본값

// // 스킨 이미지 import
import defaultSlice from '@/assets/img/skins/default_slice.png';
// import defaultTap from '@/assets/img/skins/default_tap.png';
// import waveSlice from '@/assets/img/skins/wave_slice.png';
// import thunderSlice from '@/assets/img/skins/thunder_slice.png';
// import starlightTap from '@/assets/img/skins/starlight_tap.png';
// import flowerTap from '@/assets/img/skins/flower_tap.png';

// 오염물 한글 → 영어 파일명 매핑
export const pollutionNameToFile: Record<string, string> = {
    '부유 쓰레기': floatingTrash,
    // '플라스틱 병목': plasticBottle,
    // '독성 슬러지': toxicSludge,
    // '건축 폐기물': constructionWaste,
    // '잔류 농약': pesticideResidue,
    // '중금속 슬러그': heavyMetalSlug,
    // 매연: soot,
    // 초미세먼지: ultrafineDust,
    // 다이옥신: dioxin,
    pet: pet,
};

// 스킨 한글 → 영어 파일명 매핑
export const skinNameToFile: Record<string, string> = {
    '기본 슬라이스': defaultSlice,
    // '기본 탭': defaultTap,
    // '물결 슬라이스': waveSlice,
    // '번개 슬라이스': thunderSlice,
    // '별빛 탭': starlightTap,
    // '꽃잎 탭스킨': flowerTap,
    pet: pet,
};
