package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.StagesVO;

@Mapper
public interface GamePlayMapper {

	StagesVO getstageStatus(long stage_idx, String email);
	
}
