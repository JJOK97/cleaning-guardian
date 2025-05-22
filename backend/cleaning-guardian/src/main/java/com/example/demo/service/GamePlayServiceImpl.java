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
	
	/**
	 * Updates the user's skin to the specified skin index.
	 *
	 * @param skin_idx the index of the new skin to apply
	 * @param email the user's email address
	 * @return a UserSkinDTO indicating whether the skin update was successful, along with a message and the updated skin information
	 */
	public UserSkinDTO patchSkin(long skin_idx, String email) {
		int result = GamePlayMapper.patchSkin(skin_idx, email);
		
		if(result == 0) {
			UserSkinDTO.builder()
						.success(false)
						.message("스킨 업데이트 실패")
						.build();
		}
		return UserSkinDTO.builder()
						.success(true)
						.message("스킨 업데이트 성공")
						.email(email)
						.skinIdx(skin_idx)
						.build();
	}

	/**
	 * Marks a game stage as cleared for a user and returns the result.
	 *
	 * @param stage_idx the index of the stage to clear
	 * @param email the user's email address
	 * @param successYn the initial success flag ("Y" or "N")
	 * @return a GameClearDTO indicating whether the stage clear operation was successful, including relevant details
	 */
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
	
	/**
	 * Awards points to a user as a reward and returns the result.
	 *
	 * @param email the user's email address
	 * @param value the number of points to award
	 * @return a PointDTO indicating whether the points were successfully awarded, including a message and the awarded point value if successful
	 */
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
