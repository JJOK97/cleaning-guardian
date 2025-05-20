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
import com.example.demo.dto.StageClearDTO;
import com.example.demo.service.GamePlayServiceImpl;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1")
public class GameplayController {

	@Autowired
	GamePlayServiceImpl GamePlayService;

	// 스킨 설정 PATCH
//	@PatchMapping
//	public String patchSkin(@patch)
//	
	// 스테이지 완료 처리 POST
	@PostMapping("/stages/{stageIdx}/complete")
	public ResponseEntity<StageClearDTO> stageClear(@PathVariable("stageIdx") int stage_idx,
													@RequestBody StageClearDTO clear) {
		clear.setIsFinalStage(clear.getIsFinalStage().startsWith("Y") ? "Y" : "N");
		clear.setStageIdx(stage_idx);
		StageClearDTO stage = GamePlayService.stageClear(clear);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}

	// 스테이지 상태 조회 GET
	@GetMapping("/stages/{stageIdx}/status")
	public ResponseEntity<StageDTO> getstageStatus(@PathVariable("stageIdx") int stage_idx,
												@RequestParam("email") String email) {
		StageDTO game = GamePlayService.getStageStatus(stage_idx, email);
		return new ResponseEntity<>(game, HttpStatus.OK);
	} 
	
	
}
