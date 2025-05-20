package com.example.demo.service;

import com.example.demo.dto.StageClearDTO;
import com.example.demo.dto.StageDTO;

public interface GamePlayService {

	StageClearDTO stageClear(StageClearDTO clear);
	
	StageDTO getStageStatus(long stage_idx, String email);
	
	
	
}
