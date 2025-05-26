package com.example.demo.service;

import java.util.List;

import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 사용자 수집 통계 Service
 * 
 * 게임 로직 개선을 위한 사용자별 오염물질 수집 통계 관리:
 * - 오염물질별 처치 횟수, 획득 점수, 최고 콤보 등
 * - 게임 결과와 연동하여 실시간 업데이트
 */
public interface UserCollectionStatsService {
    
    /**
     * 사용자의 특정 오염물질 통계 조회
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 사용자 수집 통계 정보
     */
    UserCollectionStatsVO getUserPollutionStats(String email, Long polIdx);
    
    /**
     * 사용자의 모든 오염물질 통계 목록 조회
     * @param email 사용자 이메일
     * @return 사용자의 전체 수집 통계 목록
     */
    List<UserCollectionStatsVO> getUserAllStats(String email);
    
    /**
     * 특정 오염물질의 전체 사용자 통계 조회
     * @param polIdx 오염물질 인덱스
     * @return 해당 오염물질의 전체 사용자 통계
     */
    List<UserCollectionStatsVO> getPollutionAllStats(Long polIdx);
    
    /**
     * 사용자 수집 통계 추가 (첫 처치 시)
     * @param stats 수집 통계 정보
     * @return 추가 성공 여부
     */
    boolean createUserStats(UserCollectionStatsVO stats);
    
    /**
     * 사용자 수집 통계 업데이트 (게임 결과 반영)
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @param defeatedCount 이번 게임에서 처치한 횟수
     * @param scoreGained 이번 게임에서 획득한 점수
     * @param maxCombo 이번 게임에서 달성한 최고 콤보
     * @return 업데이트 성공 여부
     */
    boolean updateUserStats(String email, Long polIdx, Integer defeatedCount, Long scoreGained, Integer maxCombo);
    
    /**
     * 사용자 수집 통계 존재 여부 확인
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 통계 존재 여부
     */
    boolean existsUserStats(String email, Long polIdx);
    
    /**
     * 사용자의 총 처치 횟수 조회
     * @param email 사용자 이메일
     * @return 총 처치 횟수
     */
    Integer getUserTotalDefeated(String email);
    
    /**
     * 사용자의 총 획득 점수 조회
     * @param email 사용자 이메일
     * @return 총 획득 점수
     */
    Long getUserTotalScore(String email);
    
    /**
     * 사용자의 최고 콤보 조회
     * @param email 사용자 이메일
     * @return 최고 콤보
     */
    Integer getUserMaxCombo(String email);
    
    /**
     * 사용자 수집 통계 삭제
     * @param statsIdx 통계 인덱스
     * @return 삭제 성공 여부
     */
    boolean deleteUserStats(Long statsIdx);
    
    /**
     * 게임 결과를 바탕으로 통계 업데이트 또는 생성
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @param defeatedCount 처치 횟수
     * @param scoreGained 획득 점수
     * @param maxCombo 최고 콤보
     * @return 처리 성공 여부
     */
    boolean processGameStats(String email, Long polIdx, Integer defeatedCount, Long scoreGained, Integer maxCombo);
    
} 