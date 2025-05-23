package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.UserPlayDTO;
import com.example.demo.service.GameServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class GameController {

	@Autowired
	GameServiceImpl gameService;

	// 게임 입장
	@PostMapping("/user-plays")
	public ResponseEntity<UserPlayDTO> gameStart(@RequestParam String email, @RequestParam long stageIdx) {
		UserPlayDTO gamestart = gameService.gameStart(email, stageIdx);
		return new ResponseEntity<>(gamestart, HttpStatus.OK);
	}

	// 게임 입장시 스테이지 오염물 가져오기
	@GetMapping("/user-plays/{stageIdx}")
	public ResponseEntity<PollutionsDTO> getStagePollutions(@PathVariable("stageIdx") long stageIdx) {
		PollutionsDTO pollutions = gameService.getStagePollutions(stageIdx);
		return new ResponseEntity<>(pollutions, HttpStatus.OK);
	}

}
