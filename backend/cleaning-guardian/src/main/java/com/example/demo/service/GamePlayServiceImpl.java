package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.vo.GameClearVO;
import com.example.demo.vo.StagesVO;
import com.example.demo.mapper.GamePlayMapper;

@Service
public class GamePlayServiceImpl implements GamePlayService {

	@Autowired
	GamePlayMapper GamePlayMapper;

	@Override
	public GameClearDTO stageClear(GameClearDTO clear) {
		int result = GamePlayMapper.stageClear(clear);

		if (result == 0) {
			return GameClearDTO
					.builder()
					.success(false)
					.message("실패")
					.build();
		}
		return GameClearDTO.builder().success(true).message("성공").build();
	}
	// 만약에 gameClear의 정보 ex) Y/N을 넣을 시 .gameClear

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
	
//	private GameClearVO

}
