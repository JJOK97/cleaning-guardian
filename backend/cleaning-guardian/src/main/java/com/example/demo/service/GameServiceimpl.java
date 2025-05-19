package com.example.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GameDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.MapsVO;
import com.example.demo.vo.StagesVO;

@Service
public class GameServiceimpl implements GameService{
	
	@Autowired
	GameMapper gamemapper;
	

	@Override
	public GameDTO getAllmaps(String email) {
		MapsVO maps = gamemapper.getAllmaps(email);
		
		if (maps == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		return GameDTO.builder()
				.success(true)
				.message("성공")
				.build();
	}

	@Override
	public GameDTO getMap(String email) {
		MapsVO maps = gamemapper.getMap(email);
		
		if (maps == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		return GameDTO.builder()
				.success(true)
				.message("성공")
				.build();
	}

	@Override
	public GameDTO getAllstages(int map_idx, String email) {
		StagesVO stage = gamemapper.getAllstages(map_idx,email);
		
		if (stage == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		return GameDTO.builder()
				.success(true)
				.message("성공")
				.build();
	}

	@Override
	public GameDTO getStage(int stage_idx,String email) {
		StagesVO stage = gamemapper.getStage(stage_idx,email);
		
		if (stage == null) {
			return GameDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		return GameDTO.builder()
				.success(true)
				.message("성공")
				.build();
	}

	@Override
	public GameDTO getAllcampaigns(int map_idx, String email) {
		CampaignsVO campaigns = gamemapper.getAllcampaigns(map_idx,email);
		 
		 if (campaigns == null) {
				return GameDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}
			return GameDTO.builder()
					.success(true)
					.message("성공")
					.build();
	}

	@Override
	public GameDTO campaignJoin(int map_idx, int campaign_idx, String email) {
		CampaignsVO campaigns = gamemapper.getCampaign(map_idx,campaign_idx,email);
		 
		 if (campaigns == null) {
				return GameDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}
			return GameDTO.builder()
					.success(true)
					.message("성공")
					.build();
	}

	
	
	
	
	
	
	
}
