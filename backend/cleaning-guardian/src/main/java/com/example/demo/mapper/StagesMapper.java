package com.example.demo.mapper;

import java.util.List;

import com.example.demo.vo.StagesVO;

public interface StagesMapper {

	List<StagesVO> getAllStages(long mapIdx);

	List<StagesVO> getClearedStages(long mapIdx, String email);

	StagesVO getStage(long stageIdx);

}
