package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.PollutionsVO;

@Mapper
public interface GameMapper {

	int gameStart(String email, long stageIdx);

	List<PollutionsVO> getStagePollutions(long stageIdx);
	
	List<PollutionsVO> getAllPollutions();

}
