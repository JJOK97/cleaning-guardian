package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.SkinsVO;
import java.util.List;
@Mapper
public interface SkinMapper {
	
	List<SkinsVO> getAllSkins();
	SkinsVO getSkinsDetail(long skinIdx);

}
