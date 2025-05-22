package com.example.demo.service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.PointDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.dto.UserSkinDTO;

public interface GamePlayService {

	/**
 * Processes the completion of a game stage for a user.
 *
 * @param stage_idx the identifier of the stage being cleared
 * @param email the user's email address
 * @param successYn indicates whether the stage was cleared successfully ("Y" or "N")
 * @return a GameClearDTO containing the result of the stage clear operation
 */
GameClearDTO stageClear(long stage_idx, String email, String successYn);
	
	/**
 * Updates the user's selected skin to the specified skin.
 *
 * @param skin_idx the identifier of the skin to apply
 * @param email the user's email address
 * @return a UserSkinDTO representing the user's updated skin selection
 */
UserSkinDTO patchSkin(long skin_idx, String email);

	/**
 * Awards a specified number of points to the user identified by the given email.
 *
 * @param value the number of points to be rewarded
 * @return a PointDTO containing the updated point information for the user
 */
PointDTO postPointReward(String email, int value);
	
	
	
}
