package com.example.demo.service;

import com.example.demo.dto.RewardDTO;

public interface RewardService {

	RewardDTO postPointReward(int value, String email);

}
