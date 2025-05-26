package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.UserPlayDTO;
import com.example.demo.vo.GameStageConfigVO;
import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 게임 관련 Service
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 오염물질 게임 속성 포함 조회
 * - 수집 데이터 저장 및 통계 관리
 * - 스테이지별 게임 설정 적용
 */
public interface GameService {

	/**
	 * 게임 시작 처리
	 * @param email 사용자 이메일
	 * @param stageIdx 스테이지 인덱스
	 * @return 게임 시작 결과
	 */
	UserPlayDTO gameStart(String email, long stageIdx);

	/**
	 * 스테이지별 오염물질 정보 조회 (게임 속성 포함)
	 * @param stageIdx 스테이지 인덱스
	 * @return 오염물질 목록 (baseScore, moveSpeed, sizeMultiplier, spawnWeight 포함)
	 */
	PollutionsDTO getStagePollutions(long stageIdx);

	/**
	 * 전체 오염물질 정보 조회 (게임 속성 포함)
	 * @return 전체 오염물질 목록 (게임 속성 포함)
	 */
	PollutionsDTO getAllPollutions();

	/**
	 * 스테이지별 게임 설정 조회
	 * @param stageIdx 스테이지 인덱스
	 * @return 스테이지 게임 설정 (제한시간, 생명력, 오염물질 생성 주기 등)
	 */
	GameStageConfigVO getStageConfig(Long stageIdx);

	/**
	 * 게임 결과 저장 - 처치한 오염물질 데이터 기록
	 * @param email 사용자 이메일
	 * @param defeatedPollutants 처치한 오염물질 목록 (polIdx, count, score, combo 포함)
	 * @return 저장 결과
	 */
	boolean saveGameResult(String email, List<Map<String, Object>> defeatedPollutants);

	/**
	 * 사용자 수집 통계 조회
	 * @param email 사용자 이메일
	 * @return 사용자의 전체 수집 통계
	 */
	List<UserCollectionStatsVO> getUserCollectionStats(String email);

	/**
	 * 특정 오염물질 수집 통계 조회
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @return 해당 오염물질의 수집 통계
	 */
	UserCollectionStatsVO getPollutionStats(String email, Long polIdx);

	/**
	 * 사용자가 해당 오염물질을 수집했는지 확인
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @return 수집 여부
	 */
	boolean hasCollectedPollution(String email, Long polIdx);

	/**
	 * 게임 완료 후 수집 데이터 및 통계 업데이트
	 * @param email 사용자 이메일
	 * @param gameResult 게임 결과 데이터
	 * @return 처리 결과
	 */
	boolean processGameCompletion(String email, Map<String, Object> gameResult);

}
