package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.service.CampaignServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class CampaignController {

	@Autowired
	CampaignServiceImpl campaignService;

	// 해당 맵의 모든 캠페인 정보 가져오기
	@GetMapping("/maps/{mapIdx}/campaigns")
	public ResponseEntity<CampaignsDTO> getAllCampaigns(@PathVariable("mapIdx") long mapIdx) {
		CampaignsDTO campaign = campaignService.getAllCampaigns(mapIdx);
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}

	// 선택한 캠페인 정보 가져오기
	@GetMapping("/maps/{mapIdx}/campaigns/{campaignIdx}")
	public ResponseEntity<CampaignsDTO> getCampaign(@PathVariable("mapIdx") long mapIdx,
			@PathVariable("campaignIdx") long campaignIdx) {
		CampaignsDTO campaign = campaignService.getCampaign(mapIdx, campaignIdx);
		return new ResponseEntity<>(campaign, HttpStatus.OK);
	}
}
