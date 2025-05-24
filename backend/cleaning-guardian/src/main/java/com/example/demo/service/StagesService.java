package com.example.demo.service;

import java.util.Map;

import com.example.demo.dto.StageDTO;

public interface StagesService {

	StageDTO getAllStages(long mapIdx);

	StageDTO getClearedStages(long mapIdx, String email);

	StageDTO getStage(long stageIdx);

	Map<String, Object> checkStageClear(long stageIdx, String email);

}
