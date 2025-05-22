package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.GameItemVO;

@Mapper
public interface GameItemMapper {
	
	
	List<GameItemVO> getAllItems();
	GameItemVO getItemsDetail(long itemIdx);

}
