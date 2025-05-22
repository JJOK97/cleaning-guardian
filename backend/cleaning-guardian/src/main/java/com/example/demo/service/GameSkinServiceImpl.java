package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.GameSkinsDTO;
import com.example.demo.mapper.GameSkinMapper;
import com.example.demo.vo.GameSkinsVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameSkinServiceImpl implements GameSkinService {

	private final GameSkinMapper skinMapper;

	@Override
	public GameSkinsDTO getAllSkins() {
		List<GameSkinsVO> skinList = skinMapper.getAllSkins();

		if (skinList == null) {
			return GameSkinsDTO.builder().success(false).message("스킨을 찾을 수 없습니다.").build();
		}
		return GameSkinsDTO.builder().success(true).message("성공").skinList(skinList).build();
	}

	@Override
	public GameSkinsDTO getSkin(long skinIdx) {
		if (skinIdx <= 0) {
			return GameSkinsDTO.builder().success(false).message("skinIdx가 유효하지 않습니다.").build();
		}

		GameSkinsVO skin = skinMapper.getSkin(skinIdx);

		if (skin == null) {
			return GameSkinsDTO.builder().success(false).message("해당 skinIdx에 대한 아이템이 없습니다.").build();
		}

		return GameSkinsDTO.builder().success(true).message("스킨 조회 성공").skin(skin).build();
	}

}