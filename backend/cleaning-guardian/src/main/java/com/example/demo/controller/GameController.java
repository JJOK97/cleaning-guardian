package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.service.GameServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class GameController {

	@Autowired
	GameServiceImpl gameservice;

	@GetMapping("/maps")
	public ResponseEntity<MapsDTO> getAllmaps() {
		MapsDTO maps = gameservice.getAllmaps();
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}

	@GetMapping("/maps/{mapIdx}/clear")
	public ResponseEntity<MapsDTO> getClearedMaps(@RequestParam("email") String email) {
		MapsDTO maps = gameservice.getClearedMaps(email);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}

	@GetMapping("/maps/{mapIdx}")
	public ResponseEntity<MapsDTO> mapJoin(@PathVariable("mapIdx") int map_idx) {
		MapsDTO maps = gameservice.getMap(map_idx);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}

	@GetMapping("/maps/{mapIdx}/stages")
	public ResponseEntity<StageDTO> getAllStages(@PathVariable("mapIdx") int map_idx) {
		StageDTO stage = gameservice.getAllStages(map_idx);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}

	/**
	 * Retrieves the cleared stages for a specific map and user.
	 *
	 * @param map_idx the index of the map
	 * @param email the user's email address
	 * @return a ResponseEntity containing the cleared stages for the user in the specified map
	 */
	@GetMapping("/maps/{mapIdx}/stages/clear")
	public ResponseEntity<StageDTO> getClearedStages(@PathVariable("mapIdx") int map_idx,
			@RequestParam("email") String email) {
		StageDTO stage = gameservice.getClearedStages(map_idx, email);
		return new ResponseEntity<>(stage, HttpStatus.OK);
	}

	/**
	 * Retrieves a specific stage by its index.
	 *
	 * @param stage_idx the index of the stage to retrieve
	 * @return the requested stage data wrapped in a ResponseEntity with HTTP status OK
	 */
	@GetMapping("/stages/{stageIdx}")
	public ResponseEntity<StageDTO> stageJoin(@PathVariable("stageIdx") int stage_idx) {
		StageDTO game = gameservice.getStage(stage_idx);
		return new ResponseEntity<>(game, HttpStatus.OK);
	}

	@GetMapping("/maps/{mapIdx}/campaigns")
	public ResponseEntity<CampaignsDTO> getAllCampaigns(@PathVariable("mapIdx") long map_idx) {
		System.out.println("Controller getAllCampaigns 호출됨, mapIdx=" + map_idx);
		CampaignsDTO campaign = gameservice.getAllCampaigns(map_idx);
		System.out.println("Service 호출 후, campaignlist size="
				+ (campaign.getCampaignlist() != null ? campaign.getCampaignlist().size() : 0));
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}

	@GetMapping("/maps/{mapIdx}/campaigns/{campaignIdx}")
	public ResponseEntity<CampaignsDTO> getCampaign(@PathVariable("mapIdx") long map_idx,
			@PathVariable("campaignIdx") long campaign_idx) {
		CampaignsDTO campaign = gameservice.getCampaign(map_idx, campaign_idx);
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}

}
