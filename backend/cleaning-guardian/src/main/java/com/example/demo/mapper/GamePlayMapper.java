package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GamePlayMapper {

	int stageClear(long stageIdx, String email, String successYn);

	int patchSkin(long skinIdx, String email);

}
