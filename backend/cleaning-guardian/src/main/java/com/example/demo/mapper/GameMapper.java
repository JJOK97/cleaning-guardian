package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.CampaignsVO;
import com.example.demo.vo.StagePolutionsVO;

@Mapper
public interface GameMapper {

	int gameStart(String email, long stageIdx);

	List<StagePolutionsVO> getStagePollutions(long stageIdx);

}
