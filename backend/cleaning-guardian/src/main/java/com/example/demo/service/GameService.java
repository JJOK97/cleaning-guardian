package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StagesDTO;
import com.example.demo.mapper.GameMapper;

@Service
public class GameService {
	
	@Autowired
	GameMapper gamemapper;

	public List<MapsDTO> getAllmaps() {
		return gamemapper.getAllmaps();
	}

	public List<MapsDTO> getmap(int map_idx) {
		return gamemapper.getMaps(map_idx);
	}

	public List<StagesDTO> getAllstages(int map_idx) {
		return gamemapper.getAllstages(map_idx);
	}

	public List<StagesDTO> getStages(int stage_idx) {
		return gamemapper.getStages(stage_idx);
	}

	public List<CampaignsDTO> getAllcampaigns(int map_idx) {
		return gamemapper.getAllcampaigns(map_idx);
	}

	public List<CampaignsDTO> campaignsJoin(int map_idx, int campaign_idx) {
		return gamemapper.getCampaign(map_idx,campaign_idx);
	}

	
	
	
	
	
	
	
	
}
