package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.ItemsVO;

@Mapper
public interface ItemMapper {
	
	
	List<ItemsVO> getAlluserItems();
	ItemsVO getItemDetailByIdx(long itemIdx);

}
