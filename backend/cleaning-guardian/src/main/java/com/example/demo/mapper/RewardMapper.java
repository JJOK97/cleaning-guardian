package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RewardMapper {

	int postPointReward(int value, String email);

	int postCashReward(int value, String email);

	int checkItemExists(String email, Long itemIdx);

	int insertItemReward(int value, Long itemIdx, String email);

	int updateItemReward(int value, Long itemIdx, String email);

}
