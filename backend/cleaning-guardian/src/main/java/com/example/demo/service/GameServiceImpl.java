package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.UserPlayDTO;
import com.example.demo.mapper.GameMapper;
import com.example.demo.mapper.GameStageConfigMapper;
import com.example.demo.mapper.UserCollectionStatsMapper;
import com.example.demo.vo.GameStageConfigVO;
import com.example.demo.vo.PollutionsVO;
import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 게임 관련 Service 구현체
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 오염물질 게임 속성 포함 조회
 * - 수집 데이터 저장 및 통계 관리
 * - 스테이지별 게임 설정 적용
 */
@Service
public class GameServiceImpl implements GameService {

	@Autowired
	private GameMapper gameMapper;
	
	@Autowired
	private GameStageConfigMapper gameStageConfigMapper;
	
	@Autowired
	private UserCollectionStatsMapper userCollectionStatsMapper;

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

	// 전체 오염물 조회하기
	@Override
	public PollutionsDTO getAllPollutions() {
		List<PollutionsVO> polutions = gameMapper.getAllPollutions();

		if (polutions == null) {
			return PollutionsDTO.builder().success(false).message("오염물질을 찾을 수 없습니다.").build();
		}
		return PollutionsDTO.builder().success(true).message("오염물질을 불러옵니다.").pollutionsList(polutions).build();
	}

	// 스테이지별 게임 설정 조회
	@Override
	public GameStageConfigVO getStageConfig(Long stageIdx) {
		try {
			GameStageConfigVO config = gameStageConfigMapper.getStageConfig(stageIdx);
			
			// 설정이 없으면 기본값 반환
			if (config == null) {
				config = new GameStageConfigVO();
				config.setStageIdx(stageIdx);
				config.setGameIdx(1L); // 기본 게임 ID
				config.setTimeLimit(60); // 기본 60초
				config.setInitialLives(3); // 기본 3개 생명
				config.setPollutantSpawnRate(2.0); // 기본 2초마다 생성
				config.setMaxPollutants(5); // 기본 최대 5개
				config.setDifficultyMultiplier(1.0); // 기본 난이도 배수
			}
			
			return config;
		} catch (Exception e) {
			// 에러 발생 시 기본 설정 반환
			GameStageConfigVO defaultConfig = new GameStageConfigVO();
			defaultConfig.setStageIdx(stageIdx);
			defaultConfig.setGameIdx(1L);
			defaultConfig.setTimeLimit(60);
			defaultConfig.setInitialLives(3);
			defaultConfig.setPollutantSpawnRate(2.0);
			defaultConfig.setMaxPollutants(5);
			defaultConfig.setDifficultyMultiplier(1.0);
			return defaultConfig;
		}
	}

	// 게임 결과 저장 - 처치한 오염물질 데이터 기록
	@Override
	@Transactional
	public boolean saveGameResult(String email, List<Map<String, Object>> defeatedPollutants) {
		try {
			// 1. 수집 데이터 저장 (중복 방지)
			List<Map<String, Object>> collectionData = new ArrayList<>();
			
			for (Map<String, Object> pollutant : defeatedPollutants) {
				Long polIdx = Long.valueOf(pollutant.get("polIdx").toString());
				
				// 이미 수집한 오염물질인지 확인
				if (!gameMapper.hasCollectedPollution(email, polIdx)) {
					Map<String, Object> data = new HashMap<>();
					data.put("email", email);
					data.put("polIdx", polIdx);
					collectionData.add(data);
				}
			}
			
			// 새로 수집한 오염물질이 있으면 저장
			if (!collectionData.isEmpty()) {
				gameMapper.saveMultipleCollectionData(collectionData);
			}
			
			// 2. 통계 데이터 업데이트
			for (Map<String, Object> pollutant : defeatedPollutants) {
				Long polIdx = Long.valueOf(pollutant.get("polIdx").toString());
				Integer count = Integer.valueOf(pollutant.get("count").toString());
				Long score = Long.valueOf(pollutant.get("score").toString());
				Integer combo = Integer.valueOf(pollutant.get("combo").toString());
				
				updatePollutionStats(email, polIdx, count, score, combo);
			}
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// 사용자 수집 통계 조회
	@Override
	public List<UserCollectionStatsVO> getUserCollectionStats(String email) {
		try {
			return userCollectionStatsMapper.getUserAllStats(email);
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}

	// 특정 오염물질 수집 통계 조회
	@Override
	public UserCollectionStatsVO getPollutionStats(String email, Long polIdx) {
		try {
			return userCollectionStatsMapper.getUserPollutionStats(email, polIdx);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// 사용자가 해당 오염물질을 수집했는지 확인
	@Override
	public boolean hasCollectedPollution(String email, Long polIdx) {
		try {
			return gameMapper.hasCollectedPollution(email, polIdx);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	// 게임 완료 후 수집 데이터 및 통계 업데이트
	@Override
	@Transactional
	public boolean processGameCompletion(String email, Map<String, Object> gameResult) {
		try {
			// 게임 결과에서 처치한 오염물질 목록 추출
			@SuppressWarnings("unchecked")
			List<Map<String, Object>> defeatedPollutants = 
				(List<Map<String, Object>>) gameResult.get("defeatedPollutants");
			
			if (defeatedPollutants != null && !defeatedPollutants.isEmpty()) {
				return saveGameResult(email, defeatedPollutants);
			}
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 오염물질 통계 업데이트 (내부 메서드)
	 */
	private void updatePollutionStats(String email, Long polIdx, Integer count, Long score, Integer combo) {
		try {
			// 기존 통계가 있는지 확인
			if (userCollectionStatsMapper.existsUserStats(email, polIdx)) {
				// 기존 통계 업데이트
				userCollectionStatsMapper.updateUserStats(email, polIdx, count, score, combo);
			} else {
				// 새로운 통계 생성
				UserCollectionStatsVO newStats = new UserCollectionStatsVO();
				newStats.setEmail(email);
				newStats.setPolIdx(polIdx);
				newStats.setTotalDefeated(count);
				newStats.setTotalScore(score);
				newStats.setAverageScore(score.doubleValue() / count);
				newStats.setMaxScore(score.intValue()); // Long → Integer 변환
				newStats.setMaxCombo(combo);
				newStats.setFirstDefeatedAt(LocalDateTime.now()); // Date → LocalDateTime 변환
				newStats.setLastDefeatedAt(LocalDateTime.now()); // Date → LocalDateTime 변환
				
				userCollectionStatsMapper.insertUserStats(newStats);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
