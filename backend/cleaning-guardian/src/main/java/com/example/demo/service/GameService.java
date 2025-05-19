package com.example.demo.service;




import com.example.demo.dto.GameDTO;

public interface GameService {

	GameDTO getAllmaps(String email);
	
	GameDTO getMap(long map_idx, String email);
	
	GameDTO getAllstages(long map_idx, String email);
	
	GameDTO getStage(long stage_idx, String email);
	
	GameDTO getAllcampaigns(long map_idx, String email);
	
	GameDTO campaignJoin(long map_idx, long campaign_idx, String email);
}
