package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RewardDTO;
import com.example.demo.mapper.RewardMapper;

@Service
public class RewardServiceImpl implements RewardService {

	@Autowired
	RewardMapper rewardMapper;

	@Override
	public RewardDTO postPointReward(int value, String email) {
		int result = rewardMapper.postPointReward(value, email);

		if (result == 0) {
			return RewardDTO.builder().success(false).message("보상 획득에 실패했습니다.").build();
		}
		return RewardDTO.builder().point(value).success(true).message(value + "Point 획득에 성공했습니다.").build();
	}
}
