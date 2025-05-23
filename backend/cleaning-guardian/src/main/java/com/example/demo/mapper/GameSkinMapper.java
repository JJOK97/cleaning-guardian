package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.GameSkinsVO;
import java.util.List;
@Mapper
public interface GameSkinMapper {
	
	List<GameSkinsVO> getAllSkins();
	GameSkinsVO getSkin(long skinIdx);

}
