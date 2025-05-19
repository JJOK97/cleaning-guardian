package com.example.demo.mapper;



import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GameMapper {

	MapsVO getAllmaps(@Param("email") String email);
	
	MapsVO getMap(@Param("map_idx") long map_idx, @Param("email") String email);

	StagesVO getAllstages(@Param("map_idx") long map_idx, @Param("email") String email);
		
	StagesVO getStage (@Param("stage_idx") long stage_idx, @Param("email") String email);
	
	CampaignsVO getAllcampaigns(@Param("map_idx") long map_idx, @Param("email") String email);
	
	CampaignsVO getCampaign(@Param("map_idx") long map_idx, @Param("campaign_idx") long campaign_idx, @Param("email") String email);
	
	
	
	
	
	
	
}
