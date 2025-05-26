package com.example.demo.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 사용자 수집 통계 Mapper
 * 
 * 게임 로직 개선을 위한 사용자별 오염물질 수집 통계 관리:
 * - 오염물질별 처치 횟수, 획득 점수, 최고 콤보 등
 * - 게임 결과와 연동하여 실시간 업데이트
 */
@Mapper
public interface UserCollectionStatsMapper {
    
    /**
     * 사용자의 특정 오염물질 통계 조회
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 사용자 수집 통계 정보
     */
    UserCollectionStatsVO getUserPollutionStats(@Param("email") String email, @Param("polIdx") Long polIdx);
    
    /**
     * 사용자의 모든 오염물질 통계 목록 조회
     * @param email 사용자 이메일
     * @return 사용자의 전체 수집 통계 목록
     */
    List<UserCollectionStatsVO> getUserAllStats(@Param("email") String email);
    
    /**
     * 특정 오염물질의 전체 사용자 통계 조회
     * @param polIdx 오염물질 인덱스
     * @return 해당 오염물질의 전체 사용자 통계
     */
    List<UserCollectionStatsVO> getPollutionAllStats(@Param("polIdx") Long polIdx);
    
    /**
     * 사용자 수집 통계 추가 (첫 처치 시)
     * @param stats 수집 통계 정보
     * @return 추가된 행 수
     */
    int insertUserStats(UserCollectionStatsVO stats);
    
    /**
     * 사용자 수집 통계 업데이트 (게임 결과 반영)
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @param defeatedCount 이번 게임에서 처치한 횟수
     * @param scoreGained 이번 게임에서 획득한 점수
     * @param maxCombo 이번 게임에서 달성한 최고 콤보
     * @return 업데이트된 행 수
     */
    int updateUserStats(@Param("email") String email, 
                       @Param("polIdx") Long polIdx,
                       @Param("defeatedCount") Integer defeatedCount,
                       @Param("scoreGained") Long scoreGained,
                       @Param("maxCombo") Integer maxCombo);
    
    /**
     * 사용자 수집 통계 존재 여부 확인
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 통계 존재 여부
     */
    boolean existsUserStats(@Param("email") String email, @Param("polIdx") Long polIdx);
    
    /**
     * 사용자의 총 처치 횟수 조회
     * @param email 사용자 이메일
     * @return 총 처치 횟수
     */
    Integer getUserTotalDefeated(@Param("email") String email);
    
    /**
     * 사용자의 총 획득 점수 조회
     * @param email 사용자 이메일
     * @return 총 획득 점수
     */
    Long getUserTotalScore(@Param("email") String email);
    
    /**
     * 사용자의 최고 콤보 조회
     * @param email 사용자 이메일
     * @return 최고 콤보
     */
    Integer getUserMaxCombo(@Param("email") String email);
    
    /**
     * 사용자 수집 통계 삭제
     * @param statsIdx 통계 인덱스
     * @return 삭제된 행 수
     */
    int deleteUserStats(@Param("statsIdx") Long statsIdx);
    
} 