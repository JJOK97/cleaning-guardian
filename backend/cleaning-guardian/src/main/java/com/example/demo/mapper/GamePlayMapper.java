package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.vo.StagesVO;

@Mapper
public interface GamePlayMapper {
	
	int stageClear(long stageIdx, String email, String successYn);

	int patchSkin(long skinIdx, String email);



	
}
