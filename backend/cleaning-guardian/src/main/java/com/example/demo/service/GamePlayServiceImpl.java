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
	 * @param skinIdx the index of the skin to apply
	 * @param email the user's email address
	 * @return a UserSkinDTO indicating whether the update was successful, including a message and relevant user data on success
	 */
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

	/**
	 * Records the user's attempt to clear a game stage and returns the result.
	 *
	 * If the stage clear operation is successful, returns a {@link GameClearDTO} indicating success with the updated status.
	 * If the operation fails, returns a {@link GameClearDTO} indicating failure with the provided parameters.
	 *
	 * @param stageIdx the identifier of the stage to clear
	 * @param email the user's email address
	 * @param successYn the initial success flag ("Y" or "N")
	 * @return a {@link GameClearDTO} containing the outcome, message, and relevant data
	 */
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
	
	/**
	 * Awards points to a user and returns the result.
	 *
	 * @param email the user's email address
	 * @param value the number of points to award
	 * @return a PointDTO indicating whether the points were successfully awarded, including a message and the awarded value on success
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
