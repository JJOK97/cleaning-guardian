package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Service
public class GameServiceImpl implements GameService {

	@Autowired
	GameMapper gamemapper;

	@Override
	public MapsDTO getAllmaps() {
		List<MapsVO> maplist = gamemapper.getAllmaps();

		if (maplist == null) {
			return MapsDTO.builder().success(false).message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("성공").maplist(maplist).build();
	}

	@Override
	public MapsDTO getClearedMaps(String email) {
		List<MapsVO> maplist = gamemapper.getClearedMaps(email);

		if (email == null) {
			return MapsDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (maplist == null) {
			return MapsDTO.builder().success(false).message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("성공").maplist(maplist).email(email).build();
	}

	@Override
	public MapsDTO getMap(long map_idx) {
		MapsVO map = gamemapper.getMap(map_idx);

		if (map == null) {
			return MapsDTO.builder().success(false).message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().map(map).success(true).message("성공").build();
	}

	@Override
	public StageDTO getAllStages(long map_idx) {
		List<StagesVO> stagelist = gamemapper.getAllStages(map_idx);

		if (stagelist == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stagelist(stagelist).success(true).message("성공").build();
	}

	@Override
	public StageDTO getClearedStages(long map_idx, String email) {
		List<StagesVO> stagelist = gamemapper.getClearedStages(map_idx, email);

		if (email == null) {
			return StageDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (stagelist == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stagelist(stagelist).success(true).message("성공").email(email).build();
	}

	@Override
	public StageDTO getStage(long stage_idx) {
		StagesVO stage = gamemapper.getStage(stage_idx);

		
		if (stage == null) {
			return StageDTO.builder().success(false).message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder().stage(stage).success(true).message("성공").build();
	}

	@Override
	public CampaignsDTO getAllCampaigns(long map_idx) {
		List<CampaignsVO> campaignlist = gamemapper.getAllCampaigns(map_idx);

		if (campaignlist == null) {
			return CampaignsDTO.builder().success(false).message("캠페인을 찾을 수 없습니다.").build();
		}

		for (CampaignsVO campaign : campaignlist) {
			System.out.println("하이요");
			System.out.println(campaign);
		}

		return CampaignsDTO.builder().campaignlist(campaignlist).success(true).message("성공").build();
	}

	@Override
	public CampaignsDTO getCampaign(long map_idx, long campaign_idx) {
		CampaignsVO campaign = gamemapper.getCampaign(map_idx, campaign_idx);

		if (campaign == null) {
			return CampaignsDTO.builder().success(false).message("캠페인을 찾을 수 없습니다.").build();
		}

		return CampaignsDTO.builder().campaign(campaign).success(true).message("성공").build();

	}

}
