package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.MissionClearDTO;
import com.example.demo.dto.MissionsDTO;
import com.example.demo.mapper.MissionsMapper;
import com.example.demo.vo.MissionsVO;

@Service
public class MissionsServiceImpl implements MissionsService {

	@Autowired
	MissionsMapper missionsMapper;

	@Override
	public MissionsDTO getAllMissions() {
		List<MissionsVO> missionsList = missionsMapper.getAllMissions();

		if (missionsList == null) {
			return MissionsDTO.builder().success(false).message("미션을 찾을 수 없습니다.").build();
		}

		return MissionsDTO.builder().success(true).message("모든 미션을 불러옵니다.").missionsList(missionsList).build();
	}

	@Override
	public MissionClearDTO MissionClear(long missionIdx, String email) {

		int clearMission = missionsMapper.MissionClear(missionIdx, email);

		if (clearMission == 0) {
			return MissionClearDTO.builder().success(false).message("미션 클리어 실패.").build();
		}

		return MissionClearDTO.builder().success(true).message("미션 클리어.").build();
	}
}
