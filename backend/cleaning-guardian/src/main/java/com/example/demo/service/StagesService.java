package com.example.demo.service;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.StageDTO;

public interface StagesService {

	StageDTO getAllStages(long mapIdx);

	StageDTO getClearedStages(long mapIdx, String email);

	StageDTO getStage(long stageIdx);


}
