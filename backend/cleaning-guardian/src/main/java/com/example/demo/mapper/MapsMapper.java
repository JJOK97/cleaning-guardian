package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.MapsVO;

@Mapper
public interface MapsMapper {

	
	List<MapsVO> getAllmaps();

	List<MapsVO> getClearedMaps(String email);

	MapsVO getMap(long map_idx);
}
