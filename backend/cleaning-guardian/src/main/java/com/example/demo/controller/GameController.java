package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.GameDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StagesDTO;
import com.example.demo.service.GameService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/v1")
public class GameController {

	
	@Autowired
	GameService gameservice;
	
	@GetMapping("/maps")
	public List<MapsDTO> maps() {
		return gameservice.getAllmaps();
	}
	@GetMapping("/maps/{mapIdx}")
	public List<MapsDTO> mapJoin(@PathVariable int map_idx) {
		return gameservice.getmap(map_idx);
	}
	
	@GetMapping("/maps/{mapIdx}/stages")
	public List<StagesDTO> stages(@PathVariable int map_idx) {
		return gameservice.getAllstages(map_idx);
	}
	
	@GetMapping("/stages/{stageIdx}")
	public List<StagesDTO> stageJoin(@PathVariable int stage_idx) {
		return gameservice.getStages(stage_idx);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns")
	public List<CampaignsDTO> campaigns(@PathVariable int map_idx) {
		return gameservice.getAllcampaigns(map_idx);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns/{campaingIdx}")
	public List<CampaignsDTO> campaignsJoin(@PathVariable int map_idx, @PathVariable int campaign_idx) {
		
		return gameservice.campaignsJoin(map_idx,campaign_idx);
	}
	
	
	
	
	
	
	
	
	
}
