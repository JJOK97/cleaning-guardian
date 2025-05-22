package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GameMapper {

	List<MapsVO> getAllmaps();

	List<MapsVO> getClearedMaps(String email);

	MapsVO getMap(long map_idx);

	List<StagesVO> getAllStages(long map_idx);

	/**
 * Retrieves the list of stages cleared by a specific user for a given map.
 *
 * @param map_idx the unique identifier of the map
 * @param email the email address of the user
 * @return a list of stages that the user has cleared for the specified map
 */
List<StagesVO> getClearedStages(long map_idx, String email);

	/**
 * Retrieves a stage record by its unique identifier.
 *
 * @param stage_idx the unique identifier of the stage
 * @return the stage record corresponding to the given identifier, or null if not found
 */
StagesVO getStage(long stage_idx);

	/**
 * Retrieves all campaigns associated with the specified map.
 *
 * @param map_idx the unique identifier of the map
 * @return a list of campaigns for the given map
 */
List<CampaignsVO> getAllCampaigns(long map_idx);

	CampaignsVO getCampaign(@Param("map_idx") long map_idx, @Param("campaign_idx") long campaign_idx);

}
