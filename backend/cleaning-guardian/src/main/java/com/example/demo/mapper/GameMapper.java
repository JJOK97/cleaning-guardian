package com.example.demo.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StagesDTO;

@Mapper
public interface GameMapper {

	List<MapsDTO> getAllmaps();
	
	List<MapsDTO> getMaps(int map_idx);

	List<StagesDTO> getAllstages(int map_idx);
		
	List<StagesDTO> getStages(int stage_idx);
	
	List<CampaignsDTO> getAllcampaigns(int map_idx);

	List<CampaignsDTO> getCampaign(int map_idx, int campaign_idx);
	
	
	
	
	
	
	
}
