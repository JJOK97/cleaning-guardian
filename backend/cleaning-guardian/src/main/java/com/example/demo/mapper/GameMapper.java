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
 * Retrieves the list of stages within a specified map that have been cleared by a user.
 *
 * @param map_idx the unique identifier of the map
 * @param email the user's email address
 * @return a list of cleared stages for the given map and user
 */
List<StagesVO> getClearedStages(long map_idx, String email);

	/**
 * Retrieves a stage by its unique identifier.
 *
 * @param stage_idx the unique identifier of the stage
 * @return the stage corresponding to the given identifier, or null if not found
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
