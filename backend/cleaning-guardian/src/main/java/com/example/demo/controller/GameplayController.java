package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.StageDTO;
import com.example.demo.dto.UserSkinDTO;
import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.PointDTO;
import com.example.demo.service.GamePlayServiceImpl;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1")
public class GameplayController {

	@Autowired
	GamePlayServiceImpl GamePlayService;

	/**
	 * Updates the user's skin to the specified skin index.
	 *
	 * @param skin_idx the index of the skin to set for the user
	 * @param email the email address identifying the user
	 * @return a ResponseEntity containing the updated UserSkinDTO with HTTP 200 status
	 */
	@PatchMapping("/users/me/{skinIdx}")
	public ResponseEntity<UserSkinDTO> patchSkin(@PathVariable("skinIdx") long skin_idx,
												@RequestParam("email") String email) {
		UserSkinDTO userSkin = GamePlayService.patchSkin(skin_idx, email);
		return new ResponseEntity<>(userSkin, HttpStatus.OK);
	}
	
	/**
	 * Marks a stage as completed for a user.
	 *
	 * @param stage_idx the index of the stage to complete
	 * @param email the email address of the user
	 * @return a {@link GameClearDTO} containing the result of the stage completion, wrapped in an HTTP 200 OK response
	 */
	@PostMapping("/stages/{stageIdx}/complete")
	public ResponseEntity<GameClearDTO> stageClear(@PathVariable("stageIdx") long stage_idx,
													@RequestParam("email") String email) {
			String successYn = "N";
		GameClearDTO stage = GamePlayService.stageClear(stage_idx, email, successYn);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}
	
	/**
	 * Processes a point reward for a user and returns the updated point information.
	 *
	 * @param email the user's email address
	 * @param value the amount of points to reward
	 * @return the user's updated point information wrapped in an HTTP 200 OK response
	 */
	@PatchMapping("/reward/point")
	public ResponseEntity<PointDTO> postPointReward(@RequestParam String email, @RequestParam int value) {
		PointDTO reward = GamePlayService.postPointReward(email, value);
		return new ResponseEntity<>(reward, HttpStatus.OK);
	}
	
	
	
}
