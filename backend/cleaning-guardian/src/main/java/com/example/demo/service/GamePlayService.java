package com.example.demo.service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.PointDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.dto.UserSkinDTO;

public interface GamePlayService {

	/**
 * Processes the completion of a game stage for a user and returns the result.
 *
 * @param skinIdx the identifier of the skin associated with the stage
 * @param email the user's email address
 * @param successYn indicates whether the stage was cleared successfully ("Y" or "N")
 * @return a GameClearDTO containing the outcome of the stage clear operation
 */
GameClearDTO stageClear(long skinIdx, String email, String successYn);
	
	/****
 * Updates the user's skin selection based on the provided skin index.
 *
 * @param skinIdx the identifier of the skin to apply
 * @param email the user's email address
 * @return a UserSkinDTO reflecting the user's updated skin information
 */
UserSkinDTO patchSkin(long skinIdx, String email);

	/**
 * Awards a specified number of points to the user identified by the given email.
 *
 * @param email the user's email address
 * @param value the number of points to reward
 * @return a PointDTO containing the updated point information for the user
 */
PointDTO postPointReward(String email, int value);
	
	
	
}
