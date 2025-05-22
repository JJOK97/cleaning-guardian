package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CampaignsDTO;
import com.example.demo.mapper.CampaignMapper;
import com.example.demo.vo.CampaignsVO;

@Service
public class CampaignServiceImpl implements CampaignService {

	@Autowired
	CampaignMapper campaignMapper;

	@Override
	public CampaignsDTO getAllCampaigns(long mapIdx) {
		List<CampaignsVO> campaignlist = campaignMapper.getAllCampaigns(mapIdx);

		if (campaignlist == null) {
			return CampaignsDTO.builder().success(false).message("캠페인을 찾을 수 없습니다.").build();
		}

		return CampaignsDTO.builder().campaignlist(campaignlist).success(true).message("캠페인을 불러옵니다.").build();
	}

	@Override
	public CampaignsDTO getCampaign(long mapIdx, long campaignIdx) {
		CampaignsVO campaign = campaignMapper.getCampaign(mapIdx, campaignIdx);

		if (campaign == null) {
			return CampaignsDTO.builder().success(false).message("캠페인을 찾을 수 없습니다.").build();
		}

		return CampaignsDTO.builder().campaign(campaign).success(true).message("캠페인을 불러옵니다.").build();

	}
}
