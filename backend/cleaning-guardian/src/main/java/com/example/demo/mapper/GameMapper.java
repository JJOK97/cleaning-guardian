package com.example.demo.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.GameVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GameMapper {

	MapsVO getAllmaps(@Param("email") String email);
	
	MapsVO getMap(@Param("email") String email);

	StagesVO getAllstages(@Param("map_idx") int map_idx, @Param("email") String email);
		
	StagesVO getStage (@Param("stage_idx") int stage_idx, @Param("email") String email);
	
	CampaignsVO getAllcampaigns(@Param("map_idx") int map_idx,@Param("email") String email);
	
	CampaignsVO getCampaign(@Param("map_idx") int map_idx, @Param("campaign_idx") int campaign_idx,@Param("email") String email);
	
	
	
	
	
	
	
}
