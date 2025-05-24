package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.StageDTO;
import com.example.demo.mapper.StagesMapper;
import com.example.demo.vo.StagesVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StagesServiceImpl implements StagesService {

	@Autowired
	StagesMapper stagesMapper;

	@Override
	public StageDTO getAllStages(long mapIdx) {
		List<StagesVO> stagelist = stagesMapper.getAllStages(mapIdx);

		if (stagelist == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stagelist(stagelist).success(true).message("스테이지를 불러옵니다.").build();
	}

	@Override
	public StageDTO getClearedStages(long mapIdx, String email) {
		List<StagesVO> stagelist = stagesMapper.getClearedStages(mapIdx, email);

		if (email == null) {
			return StageDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (stagelist == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stagelist(stagelist).success(true).message("스테이지를 불러옵니다.").email(email).build();
	}

	@Override
	public StageDTO getStage(long stageIdx) {
		StagesVO stage = stagesMapper.getStage(stageIdx);

		if (stage == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stage(stage).success(true).message("스테이지를 불러옵니다.").build();
	}

	// 스테이지 클리어 체크 및 다음 스테이지/맵 오픈 처리
	public Map<String, Object> checkStageClear(long stageIdx, String email) {
		log.info("Checking stage clear status - stageIdx: {}, email: {}", stageIdx, email);
		
		Map<String, Object> clearInfo = stagesMapper.checkStageClear(stageIdx, email);
		log.info("Stage clear info: {}", clearInfo);

		boolean isFinalStage = "Y".equals(clearInfo.get("is_final_stage"));
		int clearedStages = ((Number) clearInfo.get("cleared_stages_count")).intValue();
		int totalStages = ((Number) clearInfo.get("total_stages_count")).intValue();

		log.info("Stage clear status - isFinalStage: {}, clearedStages: {}, totalStages: {}", 
			isFinalStage, clearedStages, totalStages);

		return clearInfo;
	}
}
