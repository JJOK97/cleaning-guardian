package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.dto.StageDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.util.TokenGenerator;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Service
public class GameServiceimpl implements GameService {

    private final TokenGenerator tokenGenerator;

	@Autowired
	GameMapper gamemapper;

    GameServiceimpl(TokenGenerator tokenGenerator) {
        this.tokenGenerator = tokenGenerator;
    }

	@Override
	public MapsDTO getAllmaps(String email) {
		List<MapsVO> maplist = gamemapper.getAllmaps(email);

		if (email == null) {
			return MapsDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		if (maplist == null) {
			return MapsDTO.builder()
					.success(false)
					.message("맵을 찾을 수 없습니다.")
					.build();
		}

		return MapsDTO.builder()
					.success(true)
					.message("성공")
					.maplist(maplist)
					.email(email)
					.build();
	}
	
	@Override
	public MapsDTO getClearedMaps(String email) {
		List<MapsVO> maplist = gamemapper.getClearedMaps(email);

		if (email == null) {
			return MapsDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		if (maplist == null) {
			return MapsDTO.builder()
					.success(false)
					.message("맵을 찾을 수 없습니다.")
					.build();
		}

		return MapsDTO.builder()
					.success(true)
					.message("성공")
					.maplist(maplist)
					.email(email)
					.build();
	}
	
	@Override
	public MapsDTO getMap(long map_idx, String email) {
		MapsVO map = gamemapper.getMap(map_idx, email);

		if (email == null) {
			return MapsDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (map == null) {
			return MapsDTO.builder()
					.success(false)
					.message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder()
					.map(map)
					.success(true)
					.message("성공")
					.email(email)
					.build();
	}

	@Override
	public StageDTO getAllStages(long map_idx, String email) {
		List<StagesVO> stagelist = gamemapper.getAllStages(map_idx, email);

		if (email == null) {
			return StageDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (stagelist == null) {
			return StageDTO.builder()
					.success(false)
					.message("스테이지를 찾을 수 없습니다.").build();
		}

		return 		StageDTO.builder()
					.stagelist(stagelist)
					.success(true)
					.message("성공")
					.email(email)
					.build();
	}
	
	@Override
	public StageDTO getClearedStages(long map_idx, String email) {
		List<StagesVO> stagelist = gamemapper.getClearedStages(map_idx, email);

		if (email == null) {
			return StageDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (stagelist == null) {
			return StageDTO.builder()
					.success(false)
					.message("스테이지를 찾을 수 없습니다.").build();
		}

		return 		StageDTO.builder()
					.stagelist(stagelist)
					.success(true)
					.message("성공")
					.email(email)
					.build();
	}

	@Override
	public StageDTO getStage(long stage_idx, String email) {
		StagesVO stage = gamemapper.getStage(stage_idx, email);

		if (email == null) {
			return StageDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.").build();
		}
		if (stage == null) {
			return StageDTO.builder()
					.success(false)
					.message("스테이지를 찾을 수 없습니다.").build();
		}

		return StageDTO.builder()
					.stage(stage)
					.success(true)
					.message("성공")
					.email(email)
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
					.map_idx(campaigns.getMapIdx())
					.campaign_idx(campaigns.getCampaignIdx())
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
		if (campaigns.getCampaignIdx() != campaign_idx) {
			return GameDTO.builder()
					.success(false)
					.message("캠페인을 찾을 수 없습니다.").build();
		}

		return GameDTO.builder()
					.success(true)
					.map_idx(campaigns.getMapIdx())
					.campaign_idx(campaigns.getCampaignIdx())
					.message("성공")
					.build();
		
	}



}
