package com.example.demo.mapper;

import java.util.List;
import java.util.Map;

import com.example.demo.vo.StagesVO;

public interface StagesMapper {

	List<StagesVO> getAllStages(long mapIdx);

	List<StagesVO> getClearedStages(long mapIdx, String email);

	StagesVO getStage(long stageIdx);

	Map<String, Object> checkStageClear(long stageIdx, String email);

}
