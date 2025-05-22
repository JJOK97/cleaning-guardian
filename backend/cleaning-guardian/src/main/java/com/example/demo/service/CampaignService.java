package com.example.demo.service;

import com.example.demo.dto.CampaignsDTO;

public interface CampaignService {

	CampaignsDTO getAllCampaigns(long mapIdx);

	CampaignsDTO getCampaign(long mapIdx, long campaignIdx);

}
