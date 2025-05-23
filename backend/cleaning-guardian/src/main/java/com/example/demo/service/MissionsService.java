package com.example.demo.service;

import com.example.demo.dto.MissionClearDTO;
import com.example.demo.dto.MissionsDTO;

public interface MissionsService {
	
	MissionsDTO getAllMissions();
	
	MissionClearDTO MissionClear(long missionIdx, String email);
}
