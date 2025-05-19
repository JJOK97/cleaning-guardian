package com.example.demo.service;




import com.example.demo.dto.GameDTO;

public interface GameService {

	GameDTO getAllmaps(String email);
	
	GameDTO getMap(String email);
	
	GameDTO getAllstages(int map_idx,String email);
	
	GameDTO getStage(int stage_idx, String email);
	
	GameDTO getAllcampaigns(int map_idx,String email);
	
	GameDTO campaignJoin(int map_idx,int campaign_idx,String email);
}
