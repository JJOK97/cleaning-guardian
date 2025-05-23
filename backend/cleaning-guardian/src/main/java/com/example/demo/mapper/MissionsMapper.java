package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.MissionsVO;
@Mapper
public interface MissionsMapper {

	List<MissionsVO> getAllMissions();

	int MissionClear(long missionIdx, String email);

}
