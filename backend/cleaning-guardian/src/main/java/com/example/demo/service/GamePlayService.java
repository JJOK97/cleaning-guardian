package com.example.demo.service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.StageDTO;

public interface GamePlayService {

	GameClearDTO stageClear(long stage_idx, String email, String successYn);
	

	
	
	
}
