package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.PointDTO;
import com.example.demo.dto.UserSkinDTO;
import com.example.demo.mapper.GamePlayMapper;

@Service
public class GamePlayServiceImpl implements GamePlayService {

	@Autowired
	GamePlayMapper GamePlayMapper;
	
	@Override
	public UserSkinDTO patchSkin(long skinIdx, String email) {
		int result = GamePlayMapper.patchSkin(skinIdx, email);
		
		if(result == 0) {
			return UserSkinDTO.builder()
						.success(false)
						.message("스킨 업데이트 실패")
						.build();
		}
		return UserSkinDTO.builder()
						.success(true)
						.message("스킨 업데이트 성공")
						.email(email)
						.skinIdx(skinIdx)
						.build();
	}

	@Override
	public GameClearDTO stageClear(long stageIdx, String email, String successYn) {
		int result = GamePlayMapper.stageClear(stageIdx, email, successYn);

		if (result == 0) {
			return GameClearDTO
					.builder()
					.success(false)
					.message("스테이지 클리어 실패")
					.email(email)
					.stageIdx(stageIdx)
					.successYn(successYn)
					.build();
		}
		successYn = "Y";
		return GameClearDTO.builder()
				.success(true)
				.message("스테이지 클리어 성공")
				.email(email)
				.stageIdx(stageIdx)
				.successYn(successYn)
				.build();
	}
	
	@Override
	public PointDTO postPointReward(String email, int value) {
		int result = GamePlayMapper.postPointReward(email, value);
		
		if(result == 0) {
			return PointDTO.builder()
							.success(false)
							.message("보상 획득에 실패했습니다.")
							.build();
		}
		return PointDTO.builder()
						.point(value)
						.success(true)
						.message(value + "Point 획득에 성공했습니다.")
						.build();
	}

	

}
