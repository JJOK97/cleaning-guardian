package com.example.demo.service;

import com.example.demo.dto.StageDTO;

public interface GamePlayService {

	StageDTO getstageStatus(long stage_idx, String email);
	
}
