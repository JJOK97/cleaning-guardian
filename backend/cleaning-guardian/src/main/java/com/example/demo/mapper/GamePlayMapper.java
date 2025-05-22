package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GamePlayMapper {
	
	/**
 * Records the completion status of a stage for a user.
 *
 * @param stageIdx the unique identifier of the stage
 * @param email the user's email address
 * @param successYn indicates whether the stage was cleared successfully ("Y" or "N")
 * @return the number of rows affected in the database
 */
int stageClear(long stageIdx, String email, String successYn);

	/****
 * Updates the user's assigned skin to the specified skin.
 *
 * @param skinIdx the identifier of the skin to assign
 * @param email the user's email address
 * @return the number of rows affected by the update
 */
int patchSkin(long skinIdx, String email);

	/**
 * Adds a point reward of the specified value to the user identified by the given email.
 *
 * @param email the email address of the user receiving the reward
 * @param value the number of points to add
 * @return the number of rows affected in the database
 */
int postPointReward(String email, int value);


	
}
