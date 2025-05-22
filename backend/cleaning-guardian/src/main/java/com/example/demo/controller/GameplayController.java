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
	 * @param skinIdx the index of the skin to set for the user
	 * @param email the email address identifying the user
	 * @return a ResponseEntity containing the updated UserSkinDTO with HTTP status 200
	 */
	@PatchMapping("/users/me/{skinIdx}")
	public ResponseEntity<UserSkinDTO> patchSkin(@PathVariable("skinIdx") long skinIdx,
												@RequestParam("email") String email) {
		UserSkinDTO userSkin = GamePlayService.patchSkin(skinIdx, email);
		return new ResponseEntity<>(userSkin, HttpStatus.OK);
	}
	
	/**
	 * Marks the specified stage as completed for the user identified by email.
	 *
	 * @param stageIdx the index of the stage to mark as completed
	 * @param email the user's email address
	 * @return a ResponseEntity containing the stage completion result
	 */
	@PostMapping("/stages/{stageIdx}/complete")
	public ResponseEntity<GameClearDTO> stageClear(@PathVariable("stageIdx") long stageIdx,
													@RequestParam("email") String email) {
			String successYn = "N";
		GameClearDTO stage = GamePlayService.stageClear(stageIdx, email, successYn);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}
	
	/**
	 * Grants a point reward to the user with the specified email.
	 *
	 * @param value the number of points to reward
	 * @param email the user's email address
	 * @return a ResponseEntity containing the updated point information
	 */
	@PatchMapping("/reward/point")
	public ResponseEntity<PointDTO> postPointReward(@RequestParam int value, @RequestParam String email) {
		PointDTO reward = GamePlayService.postPointReward(email, value);
		return new ResponseEntity<>(reward, HttpStatus.OK);
	}
	
	
	
}
