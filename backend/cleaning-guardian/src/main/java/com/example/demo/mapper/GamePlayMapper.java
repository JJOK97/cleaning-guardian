package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.dto.StageClearDTO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GamePlayMapper {
	
	int stageClear(StageClearDTO clear);

	StagesVO getStageStatus(long stage_idx, String email);

	
}
