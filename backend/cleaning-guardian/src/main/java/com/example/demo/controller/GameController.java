package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GameDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.service.GameServiceimpl;


@RestController
@RequestMapping("/api/v1")
public class GameController {

	@Autowired
	GameServiceimpl gameservice;
	
	
	@GetMapping("/maps")
	public ResponseEntity<MapsDTO> getAllmaps(@RequestParam("email") String email) {
		MapsDTO maps = gameservice.getAllmaps(email);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/clear")
	public ResponseEntity<MapsDTO> getClearedMaps(@RequestParam("email") String email) {
		MapsDTO maps = gameservice.getClearedMaps(email);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}
	
	
	@GetMapping("/maps/{mapIdx}")
	public ResponseEntity<MapsDTO> mapJoin(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email) {
		MapsDTO maps = gameservice.getMap(map_idx, email);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/stages")
	public ResponseEntity<StageDTO> stages(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email) {
		StageDTO stage = gameservice.getAllstages(map_idx,email);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}
	
	@GetMapping("/stages/{stageIdx}")
	public ResponseEntity<GameDTO> stageJoin(@PathVariable("stageIdx") int stage_idx,@RequestParam("email") String email) {
		GameDTO game = gameservice.getStage(stage_idx,email);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns")
	public ResponseEntity<GameDTO> campaigns(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email)	 {
		GameDTO game = gameservice.getAllcampaigns(map_idx,email);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns/{campaingIdx}")
	public ResponseEntity<GameDTO> campaignsJoin(@PathVariable("mapIdx") int map_idx, @PathVariable("campaingIdx") int campaign_idx,@RequestParam("email") String email) {
		GameDTO game = gameservice.campaignJoin(map_idx,campaign_idx,email);
		return new ResponseEntity<>(game,HttpStatus.OK);
	}
	
	
	
	
	
	
	
	
	
}
