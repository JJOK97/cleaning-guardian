package com.example.demo.service;




import com.example.demo.dto.GameDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.vo.StagesVO;

public interface GameService {

	MapsDTO getAllmaps(String email);
	
	MapsDTO getClearedMaps(String email);
	
	MapsDTO getMap(long map_idx, String email);
	
	StageDTO getAllStages(long map_idx, String email);
	
	GameDTO getStage(long stage_idx, String email);
	
	GameDTO getAllcampaigns(long map_idx, String email);
	
	GameDTO campaignJoin(long map_idx, long campaign_idx, String email);
}
