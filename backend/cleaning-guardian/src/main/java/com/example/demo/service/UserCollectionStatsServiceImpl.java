package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.mapper.UserCollectionStatsMapper;
import com.example.demo.vo.UserCollectionStatsVO;

import lombok.extern.slf4j.Slf4j;

/**
 * 사용자 수집 통계 Service 구현체
 * 
 * 게임 로직 개선을 위한 사용자별 오염물질 수집 통계 관리:
 * - 오염물질별 처치 횟수, 획득 점수, 최고 콤보 등
 * - 게임 결과와 연동하여 실시간 업데이트
 */
@Slf4j
@Service
public class UserCollectionStatsServiceImpl implements UserCollectionStatsService {

    @Autowired
    private UserCollectionStatsMapper userCollectionStatsMapper;

    @Override
    public UserCollectionStatsVO getUserPollutionStats(String email, Long polIdx) {
        try {
            return userCollectionStatsMapper.getUserPollutionStats(email, polIdx);
        } catch (Exception e) {
            log.error("사용자 오염물질 통계 조회 실패: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<UserCollectionStatsVO> getUserAllStats(String email) {
        try {
            return userCollectionStatsMapper.getUserAllStats(email);
        } catch (Exception e) {
            log.error("사용자 전체 통계 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserCollectionStatsVO> getPollutionAllStats(Long polIdx) {
        try {
            return userCollectionStatsMapper.getPollutionAllStats(polIdx);
        } catch (Exception e) {
            log.error("오염물질 전체 통계 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public boolean createUserStats(UserCollectionStatsVO stats) {
        try {
            int result = userCollectionStatsMapper.insertUserStats(stats);
            return result > 0;
        } catch (Exception e) {
            log.error("사용자 통계 생성 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateUserStats(String email, Long polIdx, Integer defeatedCount, Long scoreGained, Integer maxCombo) {
        try {
            int result = userCollectionStatsMapper.updateUserStats(email, polIdx, defeatedCount, scoreGained, maxCombo);
            return result > 0;
        } catch (Exception e) {
            log.error("사용자 통계 업데이트 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean existsUserStats(String email, Long polIdx) {
        try {
            return userCollectionStatsMapper.existsUserStats(email, polIdx);
        } catch (Exception e) {
            log.error("사용자 통계 존재 여부 확인 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public Integer getUserTotalDefeated(String email) {
        try {
            Integer total = userCollectionStatsMapper.getUserTotalDefeated(email);
            return total != null ? total : 0;
        } catch (Exception e) {
            log.error("사용자 총 처치 횟수 조회 실패: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public Long getUserTotalScore(String email) {
        try {
            Long total = userCollectionStatsMapper.getUserTotalScore(email);
            return total != null ? total : 0L;
        } catch (Exception e) {
            log.error("사용자 총 점수 조회 실패: {}", e.getMessage());
            return 0L;
        }
    }

    @Override
    public Integer getUserMaxCombo(String email) {
        try {
            Integer maxCombo = userCollectionStatsMapper.getUserMaxCombo(email);
            return maxCombo != null ? maxCombo : 0;
        } catch (Exception e) {
            log.error("사용자 최고 콤보 조회 실패: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    @Transactional
    public boolean deleteUserStats(Long statsIdx) {
        try {
            int result = userCollectionStatsMapper.deleteUserStats(statsIdx);
            return result > 0;
        } catch (Exception e) {
            log.error("사용자 통계 삭제 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public boolean processGameStats(String email, Long polIdx, Integer defeatedCount, Long scoreGained, Integer maxCombo) {
        try {
            // 기존 통계가 있는지 확인
            if (existsUserStats(email, polIdx)) {
                // 기존 통계 업데이트
                return updateUserStats(email, polIdx, defeatedCount, scoreGained, maxCombo);
            } else {
                // 새로운 통계 생성
                UserCollectionStatsVO newStats = new UserCollectionStatsVO();
                newStats.setEmail(email);
                newStats.setPolIdx(polIdx);
                newStats.setTotalDefeated(defeatedCount);
                newStats.setTotalScore(scoreGained);
                newStats.setAverageScore(scoreGained.doubleValue() / defeatedCount);
                newStats.setMaxScore(scoreGained.intValue()); // Long → Integer 변환
                newStats.setMaxCombo(maxCombo);
                newStats.setFirstDefeatedAt(LocalDateTime.now()); // Date → LocalDateTime 변환
                newStats.setLastDefeatedAt(LocalDateTime.now()); // Date → LocalDateTime 변환
                
                return createUserStats(newStats);
            }
        } catch (Exception e) {
            log.error("게임 통계 처리 실패: {}", e.getMessage());
            return false;
        }
    }
} 