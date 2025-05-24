package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.UserSkinDTO;
import com.example.demo.mapper.GamePlayMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GamePlayServiceImpl implements GamePlayService {

	@Autowired
	GamePlayMapper gamePlayMapper;

	@Override
	public UserSkinDTO patchSkin(long skinIdx, String email) {
		int result = gamePlayMapper.patchSkin(skinIdx, email);

		if (result == 0) {
			return UserSkinDTO.builder().success(false).message("스킨 업데이트 실패").build();
		}
		return UserSkinDTO.builder().success(true).message("스킨 업데이트 성공").email(email).skinIdx(skinIdx).build();
	}

	@Override
	public GameClearDTO stageClear(long stageIdx, String email, String successYn) {
		log.info("Stage Clear Service - Before DB Update - stageIdx: {}, email: {}, successYn: {}", stageIdx, email, successYn);
		
		int result = gamePlayMapper.stageClear(stageIdx, email, successYn);
		log.info("Stage Clear Service - After DB Update - result: {}", result);

		if (result == 0) {
			log.error("Stage Clear Failed - DB Update returned 0");
			return GameClearDTO.builder()
				.success(false)
				.message("스테이지 클리어 실패")
				.email(email)
				.stageIdx(stageIdx)
				.successYn("N")
				.build();
		}
		
		log.info("Stage Clear Success - DB Update successful");
		return GameClearDTO.builder()
			.success(true)
			.message("스테이지 클리어 성공")
			.email(email)
			.stageIdx(stageIdx)
			.successYn(successYn)
			.build();
	}

}
