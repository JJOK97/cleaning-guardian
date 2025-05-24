package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RewardDTO;
import com.example.demo.dto.RewardDetail;
import com.example.demo.service.RewardService;

@RestController
@RequestMapping("/api/v1")
public class RewardController {

	@Autowired
	private RewardService rewardService;

	/**
	 * 보상 지급
	 * @param email 사용자 이메일
	 * @param rewards 보상 목록
	 * @return 보상 지급 결과
	 */
	@PostMapping("/reward")
	public ResponseEntity<RewardDTO> postReward(
			@RequestParam String email,
			@RequestBody List<RewardDetail> rewards) {
		RewardDTO response = rewardService.postReward(email, rewards);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
