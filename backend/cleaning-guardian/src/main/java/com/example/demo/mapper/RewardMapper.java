package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RewardMapper {

	int postPointReward(int value, String email);

}
