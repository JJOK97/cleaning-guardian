package com.example.demo.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.PollutionsVO;

/**
 * 게임 관련 Mapper
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 오염물질 게임 속성 포함 조회
 * - 수집 데이터 저장 기능
 */
@Mapper
public interface GameMapper {

	/**
	 * 게임 시작 기록
	 * @param email 사용자 이메일
	 * @param stageIdx 스테이지 인덱스
	 * @return 처리 결과
	 */
	int gameStart(String email, long stageIdx);

	/**
	 * 스테이지별 오염물질 정보 조회 (게임 속성 포함)
	 * @param stageIdx 스테이지 인덱스
	 * @return 오염물질 목록 (baseScore, moveSpeed, sizeMultiplier, spawnWeight 포함)
	 */
	List<PollutionsVO> getStagePollutions(long stageIdx);
	
	/**
	 * 전체 오염물질 정보 조회 (게임 속성 포함)
	 * @return 전체 오염물질 목록 (게임 속성 포함)
	 */
	List<PollutionsVO> getAllPollutions();

	/**
	 * 게임 결과 저장 - 처치한 오염물질 데이터를 user_collection에 기록
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @param defeatedCount 처치 횟수
	 * @param scoreGained 획득 점수
	 * @param maxCombo 최고 콤보
	 * @return 처리 결과
	 */
	int saveCollectionData(@Param("email") String email, 
	                      @Param("polIdx") Long polIdx,
	                      @Param("defeatedCount") Integer defeatedCount,
	                      @Param("scoreGained") Long scoreGained,
	                      @Param("maxCombo") Integer maxCombo);

	/**
	 * 게임 결과 저장 - 여러 오염물질 데이터를 한 번에 기록
	 * @param collectionData 수집 데이터 목록 (email, polIdx 포함)
	 * @return 처리 결과
	 */
	int saveMultipleCollectionData(@Param("collectionList") List<Map<String, Object>> collectionData);

	/**
	 * 사용자가 해당 오염물질을 이미 수집했는지 확인
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @return 수집 여부
	 */
	boolean hasCollectedPollution(@Param("email") String email, @Param("polIdx") Long polIdx);

}
