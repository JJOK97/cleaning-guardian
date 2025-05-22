package com.example.demo.service;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;

public interface GameService {

	MapsDTO getAllmaps();

	MapsDTO getClearedMaps(String email);

	MapsDTO getMap(long map_idx);

	StageDTO getAllStages(long map_idx);

	/**
 * Retrieves the stages cleared by the specified user for a given map.
 *
 * @param map_idx the identifier of the map
 * @param email the email address of the user
 * @return a StageDTO containing the cleared stages for the user on the specified map
 */
StageDTO getClearedStages(long map_idx, String email);

	/**
 * Retrieves the stage data transfer object (DTO) for the specified stage.
 *
 * @param stage_idx the unique identifier of the stage
 * @return the StageDTO corresponding to the given stage index
 */
StageDTO getStage(long stage_idx);

	/****
 * Retrieves all campaigns associated with the specified map.
 *
 * @param map_idx the unique identifier of the map
 * @return a CampaignsDTO containing all campaigns for the given map
 */
CampaignsDTO getAllCampaigns(long map_idx);

	CampaignsDTO getCampaign(long map_idx, long campaign_idx);

}
