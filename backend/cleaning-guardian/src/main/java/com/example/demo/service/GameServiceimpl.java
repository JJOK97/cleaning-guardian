package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.util.TokenGenerator;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Service
public class GameServiceimpl implements GameService {

	@Autowired
	GameMapper gamemapper;

	@Override
	public GameDTO getAllmaps(String email) {
		MapsVO maps = gamemapper.getAllmaps(email);

		if (email == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		if (maps == null) {
			return GameDTO.builder()
					.success(false)
					.message("맵을 찾을 수 없습니다.")
					.build();
		}

		return GameDTO.builder()
					.success(true)
					.message("성공")
					.game_idx(maps.getGame_idx())
					.map_idx(maps.getMap_idx())
					.build();
	}

	@Override
	public GameDTO getMap(long map_idx, String email) {
		MapsVO maps = gamemapper.getMap(map_idx, email);

		if (email == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (maps == null) {
			return GameDTO.builder()
					.success(false)
					.message("맵을 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.message("성공")
					.game_idx(maps.getGame_idx())
					.map_idx(maps.getMap_idx())
					.build();
	}

	@Override
	public GameDTO getAllstages(long map_idx, String email) {
		StagesVO stages = gamemapper.getAllstages(map_idx, email);

		if (email == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (stages == null) {
			return GameDTO.builder()
					.success(false)
					.message("스테이지를 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.message("성공")
					.map_idx(stages.getMap_idx())
					.stage_idx(stages.getStage_idx())
					.build();
	}

	@Override
	public GameDTO getStage(long stage_idx, String email) {
		StagesVO stages = gamemapper.getStage(stage_idx, email);

		if (email == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (stages == null) {
			return GameDTO.builder()
					.success(false)
					.message("스테이지를 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.message("성공")
					.map_idx(stages.getMap_idx())
					.stage_idx(stages.getStage_idx())
					.build();
	}

	@Override
	public GameDTO getAllcampaigns(long map_idx, String email) {
		CampaignsVO campaigns = gamemapper.getAllcampaigns(map_idx, email);

		if (email == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (campaigns == null) {
			return GameDTO.builder()
					.success(false)
					.message("캠페인을 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.map_idx(campaigns.getMap_idx())
					.campaign_idx(campaigns.getCampaign_idx())
					.message("성공")
					.build();
	}

	@Override
	public GameDTO campaignJoin(long map_idx, long campaign_idx, String email) {
		CampaignsVO campaigns = gamemapper.getCampaign(map_idx, campaign_idx, email);

		if (campaigns == null) {
			return GameDTO.builder()
					.success(false)
					.message("켐페인을 찾을 수 없습니다.").build();
		}
		if (campaigns.getCampaign_idx() != campaign_idx) {
			return GameDTO.builder()
					.success(false)
					.message("캠페인을 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.map_idx(campaigns.getMap_idx())
					.campaign_idx(campaigns.getCampaign_idx())
					.message("성공")
					.build();
		
	}

}
