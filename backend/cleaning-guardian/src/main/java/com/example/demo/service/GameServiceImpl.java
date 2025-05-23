package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.StagePollutionsDTO;
import com.example.demo.dto.UserPlayDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.vo.PollutionsVO;
import com.example.demo.vo.StagePolutionsVO;

@Service
public class GameServiceImpl implements GameService {

	@Autowired
	GameMapper gameMapper;

	// 게임 입장
	@Override
	public UserPlayDTO gameStart(String email, long stageIdx) {
		int result = gameMapper.gameStart(email, stageIdx);

		if (result == 0) {
			return UserPlayDTO.builder().success(false).message("계정을 찾을 수 없습니다.").build();
		}
		return UserPlayDTO.builder().email(email).stageIdx(stageIdx).success(true).message("게임 시작").build();
	}

	// 게임 입장 시 스테이지 오염물 가져오기
	@Override
	public PollutionsDTO getStagePollutions(long stageIdx) {
		List<PollutionsVO> polutionsList = gameMapper.getStagePollutions(stageIdx);

		if (polutionsList == null) {
			return PollutionsDTO.builder().success(false).message("오염물질을 찾을 수 없습니다.").build();
		}
		return PollutionsDTO.builder().pollutionsList(polutionsList).success(true).message("오염물질을 불러옵니다.").build();
	}

}
