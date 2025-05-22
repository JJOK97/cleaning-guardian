package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RewardDTO;
import com.example.demo.service.RewardService;
@RestController
@RequestMapping("/api/v1")
public class RewardController {
	
	@Autowired
	RewardService rewardService;

	
	// 보상 수령 (포인트) PATCH
		@PatchMapping("/reward/point")
		public ResponseEntity<RewardDTO> postPointReward(@RequestParam int value, @RequestParam String email) {
			RewardDTO reward = rewardService.postPointReward(value, email);
			return new ResponseEntity<>(reward, HttpStatus.OK);
		}
}
