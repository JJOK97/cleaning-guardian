package com.example.demo.service;

import java.util.List;
import com.example.demo.dto.RewardDTO;
import com.example.demo.dto.RewardDetail;

public interface RewardService {

	RewardDTO postReward(String email, List<RewardDetail> rewards);

}
