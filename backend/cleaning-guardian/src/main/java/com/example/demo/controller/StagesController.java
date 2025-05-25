package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.StageDTO;
import com.example.demo.service.StagesServiceImpl;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class StagesController {

	@Autowired
	StagesServiceImpl stagesservice;

	// 선택한 스테이지 가져오기
	@GetMapping("/maps/{mapIdx}/stages")
	public ResponseEntity<StageDTO> getAllStages(@PathVariable("mapIdx") long mapIdx) {
		StageDTO game = stagesservice.getAllStages(mapIdx);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}

	// 선택한 스테이지 가져오기
	@GetMapping("/maps/{mapIdx}/stages/clear")
	public ResponseEntity<StageDTO> getClearedStages(@PathVariable("mapIdx") long mapIdx, @RequestParam String email) {
		StageDTO game = stagesservice.getClearedStages(mapIdx, email);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}

	// 선택한 스테이지 가져오기
	@GetMapping("/stages/{stageIdx}")
	public ResponseEntity<StageDTO> stageJoin(@PathVariable("stageIdx") long stageIdx) {
		StageDTO game = stagesservice.getStage(stageIdx);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}

	// 스테이지 클리어 체크
	@GetMapping("/stages/{stageIdx}/clear-check")
	public ResponseEntity<Map<String, Object>> checkStageClear(
			@PathVariable("stageIdx") long stageIdx,
			@RequestParam String email) {
		Map<String, Object> clearInfo = stagesservice.checkStageClear(stageIdx, email);
		return new ResponseEntity<>(clearInfo, HttpStatus.OK);
	}

}
