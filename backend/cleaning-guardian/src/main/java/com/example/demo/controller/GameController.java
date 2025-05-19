package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GameDTO;
import com.example.demo.service.GameServiceimpl;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;


@RestController
@RequestMapping("/api/v1")
public class GameController {

	@Autowired
	GameServiceimpl gameservice;
	
	
	@GetMapping("/maps")
	public ResponseEntity<List<MapsVO>> maps(@RequestParam("email") String email) {
		GameDTO game = gameservice.getAllmaps(email);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}")
	public ResponseEntity<List<MapsVO>> mapJoin(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email) {
		List<MapsVO> list = gameservice.getMap(email);
		return new ResponseEntity<>(list, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/stages")
	public ResponseEntity<List<StagesVO>> stages(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email) {
		List<StagesVO> stages = gameservice.getAllstages(map_idx,email);
		return new ResponseEntity<>(stages, HttpStatus.OK);
	}
	
	@GetMapping("/stages/{stageIdx}")
	public ResponseEntity<List<StagesVO>> stageJoin(@PathVariable("stageIdx") int stage_idx,@RequestParam("email") String email) {
		List<StagesVO> stages = gameservice.getStage(stage_idx,email);
		return new ResponseEntity<>(stages, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns")
	public ResponseEntity<List<CampaignsVO>> campaigns(@PathVariable("mapIdx") int map_idx,@RequestParam("email") String email)	 {
		List<CampaignsVO> campaign = gameservice.getAllcampaigns(map_idx,email);
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}
	
	@GetMapping("/maps/{mapIdx}/campaigns/{campaingIdx}")
	public ResponseEntity<List<CampaignsVO>> campaignsJoin(@PathVariable("mapIdx") int map_idx, @PathVariable("campaingIdx") int campaign_idx,@RequestParam("email") String email) {
		List<CampaignsVO> campaign = gameservice.campaignJoin(map_idx,campaign_idx,email);
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}
	
	
	
	
	
	
	
	
	
}
