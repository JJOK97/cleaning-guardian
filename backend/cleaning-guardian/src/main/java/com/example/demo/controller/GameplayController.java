package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.UserSkinDTO;
import com.example.demo.service.GamePlayServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class GameplayController {

	@Autowired
	GamePlayServiceImpl gamePlayService;

	// 스테이지 완료 처리 POST
	@PostMapping("/stages/{stageIdx}/complete")
	public ResponseEntity<GameClearDTO> stageClear(@PathVariable("stageIdx") long stageIdx,
			@RequestParam("email") String email) {
		String successYn = "N";
		GameClearDTO stage = gamePlayService.stageClear(stageIdx, email, successYn);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}

}
