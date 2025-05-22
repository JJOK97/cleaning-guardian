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

	// 스킨 설정 PATCH
	@PatchMapping("/users/me/{skinIdx}")
	public ResponseEntity<UserSkinDTO> patchSkin(@PathVariable("skinIdx") long skinIdx,
												@RequestParam("email") String email) {
		UserSkinDTO userSkin = GamePlayService.patchSkin(skinIdx, email);
		return new ResponseEntity<>(userSkin, HttpStatus.OK);
	}
	
	// 스테이지 완료 처리 POST
	@PostMapping("/stages/{stageIdx}/complete")
	public ResponseEntity<GameClearDTO> stageClear(@PathVariable("stageIdx") long stageIdx,
													@RequestParam("email") String email) {
			String successYn = "N";
		GameClearDTO stage = GamePlayService.stageClear(stageIdx, email, successYn);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}
	
	// 보상 수령 (포인트) PATCH
	@PatchMapping("/reward/point")
	public ResponseEntity<PointDTO> postPointReward(@RequestParam int value, @RequestParam String email) {
		PointDTO reward = GamePlayService.postPointReward(email, value);
		return new ResponseEntity<>(reward, HttpStatus.OK);
	}
	
	
	
}
