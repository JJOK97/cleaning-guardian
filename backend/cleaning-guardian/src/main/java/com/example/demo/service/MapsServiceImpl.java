package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.MapsDTO;
import com.example.demo.mapper.MapsMapper;
import com.example.demo.vo.MapsVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MapsServiceImpl implements MapsService {

	@Autowired
	MapsMapper mapsMapper;

	@Override
	public MapsDTO getAllmaps() {
		List<MapsVO> maplist = mapsMapper.getAllmaps();

		if (maplist == null) {
			return MapsDTO.builder().success(false).message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("모든 맵을 불러옵니다.").maplist(maplist).build();
	}

	@Override
	public MapsDTO getClearedMaps(String email) {
		List<MapsVO> maplist = mapsMapper.getClearedMaps(email);

		if (email == null) {
			return MapsDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (maplist == null) {
			return MapsDTO.builder().success(false).message("사용자가 클리어한 맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("맵을 불러옵니다.").maplist(maplist).email(email).build();
	}

	@Override
	public MapsDTO getMap(long map_idx) {
		MapsVO map = mapsMapper.getMap(map_idx);

		if (map == null) {
			return MapsDTO.builder().success(false).message("해당 맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().map(map).success(true).message("맵을 불러옵니다.").build();
	}

	// 맵 클리어 체크 및 다음 맵 오픈 처리
	public Map<String, Object> checkMapClear(long mapIdx, String email) {
		log.info("Checking map clear status - mapIdx: {}, email: {}", mapIdx, email);
		
		Map<String, Object> clearInfo = mapsMapper.checkMapClear(mapIdx, email);
		log.info("Map clear info: {}", clearInfo);

		int clearedStages = ((Number) clearInfo.get("cleared_stages_count")).intValue();
		int totalStages = ((Number) clearInfo.get("total_stages_count")).intValue();
		Long nextMapIdx = (Long) clearInfo.get("next_map_idx");

		log.info("Map clear status - clearedStages: {}, totalStages: {}, nextMapIdx: {}", 
			clearedStages, totalStages, nextMapIdx);

		// 모든 스테이지 클리어 시 다음 맵 오픈
		if (clearedStages == totalStages && nextMapIdx != null) {
			log.info("All stages cleared for map: {}, next map will be opened: {}", mapIdx, nextMapIdx);
		}

		return clearInfo;
	}
}
