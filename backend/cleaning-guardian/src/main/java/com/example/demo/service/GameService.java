package com.example.demo.service;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;

public interface GameService {

	MapsDTO getAllmaps();

	MapsDTO getClearedMaps(String email);

	MapsDTO getMap(long map_idx);

	StageDTO getAllStages(long map_idx);

	StageDTO getClearedStages(long map_idx, String email);

	StageDTO getStage(long stage_idx, String email);

	CampaignsDTO getAllCampaigns(long map_idx);

	CampaignsDTO getCampaign(long map_idx, long campaign_idx);

}
