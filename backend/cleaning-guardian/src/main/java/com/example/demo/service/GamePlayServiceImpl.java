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
	public GameClearDTO stageClear(long stage_idx, String email, String successYn) {
		int result = GamePlayMapper.stageClear(stage_idx, email, successYn);

		if (result == 0) {
			return GameClearDTO
					.builder()
					.success(false)
					.message("스테이지 클리어 실패")
					.email(email)
					.stageIdx(stage_idx)
					.successYn(successYn)
					.build();
		}
		successYn = "Y";
		return GameClearDTO.builder()
				.success(true)
				.message("스테이지 클리어 성공")
				.email(email)
				.stageIdx(stage_idx)
				.successYn(successYn)
				.build();
	}

}
