package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.StageClearDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.vo.StagesVO;
import com.example.demo.mapper.GamePlayMapper;

@Service
public class GamePlayServiceImpl implements GamePlayService {

	@Autowired
	GamePlayMapper GamePlayMapper;

	@Override
	public StageClearDTO stageClear(StageClearDTO clear) {
		int result = GamePlayMapper.stageClear(clear);

		if (result == 0) {
			return StageClearDTO.builder().success(false).message("실패").build();
		}
		return StageClearDTO.builder().success(true).message("성공").build();
	}

	@Override
	public StageDTO getStageStatus(long stage_idx, String email) {
		StagesVO stage = GamePlayMapper.getStageStatus(stage_idx, email);
		if (email == null) {
			return StageDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (stage == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}
		return StageDTO.builder().stage(stage).success(true).message("성공").email(email).build();

	}

}
