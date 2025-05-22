package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GamePlayMapper {
	
	/****
 * Records the completion status of a stage for a user.
 *
 * @param stage_idx the identifier of the stage
 * @param email the user's email address
 * @param successYn indicates whether the stage was cleared successfully ("Y" or "N")
 * @return the number of rows affected by the update
 */
int stageClear(long stage_idx, String email, String successYn);

	/****
 * Updates the user's skin selection to the specified skin.
 *
 * @param skin_idx the identifier of the skin to assign
 * @param email the user's email address
 * @return the number of rows affected by the update
 */
int patchSkin(long skin_idx, String email);

	/**
 * Adds or updates a point reward for the specified user.
 *
 * @param email the email address of the user
 * @param value the number of points to reward
 * @return the number of rows affected by the operation
 */
int postPointReward(String email, int value);


	
}
