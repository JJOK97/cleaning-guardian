package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.CampaignsVO;

@Mapper
public interface CampaignMapper {

	List<CampaignsVO> getAllCampaigns(long mapIdx);

	CampaignsVO getCampaign(long mapIdx, long campaignIdx);
}
