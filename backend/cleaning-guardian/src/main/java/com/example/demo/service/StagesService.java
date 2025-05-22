package com.example.demo.service;

import com.example.demo.dto.StageDTO;
import com.example.demo.dto.StagePollutionsDTO;

public interface StagesService {

	StageDTO getAllStages(long mapIdx);

	StageDTO getClearedStages(long mapIdx, String email);

	StageDTO getStage(long stageIdx);

	StagePollutionsDTO getAllPollutions(long stageIdx);

}
