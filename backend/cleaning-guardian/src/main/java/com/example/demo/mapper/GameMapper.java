package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.dto.StagePollutionsDTO;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagePolutionsVO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GameMapper {

	List<MapsVO> getAllmaps();

	List<MapsVO> getClearedMaps(String email);

	MapsVO getMap(long map_idx);

	List<StagesVO> getAllStages(long map_idx);

	List<StagesVO> getClearedStages(long map_idx, String email);

	StagesVO getStage(long stage_idx, String email);

	List<StagePolutionsVO> getAllPollutions(long stage_idx);

	
	
	
	
	List<CampaignsVO> getAllCampaigns(long map_idx);

	CampaignsVO getCampaign(@Param("map_idx") long map_idx, @Param("campaign_idx") long campaign_idx);


}
