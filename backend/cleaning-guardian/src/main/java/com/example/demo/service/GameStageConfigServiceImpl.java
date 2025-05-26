package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.mapper.GameStageConfigMapper;
import com.example.demo.vo.GameStageConfigVO;

import lombok.extern.slf4j.Slf4j;

/**
 * 스테이지별 게임 설정 Service 구현체
 * 
 * 게임 로직 개선을 위한 스테이지별 게임 설정 관리:
 * - 제한 시간, 초기 생명력, 오염물질 생성 주기 등
 * - 스테이지별로 다른 게임 난이도와 설정 적용
 */
@Slf4j
@Service
public class GameStageConfigServiceImpl implements GameStageConfigService {

    @Autowired
    private GameStageConfigMapper gameStageConfigMapper;

    @Override
    public GameStageConfigVO getStageConfig(Long stageIdx) {
        try {
            GameStageConfigVO config = gameStageConfigMapper.getStageConfig(stageIdx);
            
            // 설정이 없으면 기본 설정 생성
            if (config == null) {
                log.info("스테이지 {}의 설정이 없어 기본 설정을 생성합니다.", stageIdx);
                config = createDefaultStageConfig(stageIdx, 1L);
            }
            
            return config;
        } catch (Exception e) {
            log.error("스테이지 설정 조회 실패: {}", e.getMessage());
            return createDefaultStageConfig(stageIdx, 1L);
        }
    }

    @Override
    public List<GameStageConfigVO> getAllStageConfigs() {
        try {
            return gameStageConfigMapper.getAllStageConfigs();
        } catch (Exception e) {
            log.error("전체 스테이지 설정 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<GameStageConfigVO> getStageConfigsByGame(Long gameIdx) {
        try {
            return gameStageConfigMapper.getStageConfigsByGame(gameIdx);
        } catch (Exception e) {
            log.error("게임별 스테이지 설정 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public boolean createStageConfig(GameStageConfigVO config) {
        try {
            int result = gameStageConfigMapper.insertStageConfig(config);
            return result > 0;
        } catch (Exception e) {
            log.error("스테이지 설정 생성 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateStageConfig(GameStageConfigVO config) {
        try {
            int result = gameStageConfigMapper.updateStageConfig(config);
            return result > 0;
        } catch (Exception e) {
            log.error("스테이지 설정 수정 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public boolean deleteStageConfig(Long configIdx) {
        try {
            int result = gameStageConfigMapper.deleteStageConfig(configIdx);
            return result > 0;
        } catch (Exception e) {
            log.error("스테이지 설정 삭제 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean existsStageConfig(Long stageIdx) {
        try {
            return gameStageConfigMapper.existsStageConfig(stageIdx);
        } catch (Exception e) {
            log.error("스테이지 설정 존재 여부 확인 실패: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public GameStageConfigVO createDefaultStageConfig(Long stageIdx, Long gameIdx) {
        GameStageConfigVO defaultConfig = new GameStageConfigVO();
        defaultConfig.setStageIdx(stageIdx);
        defaultConfig.setGameIdx(gameIdx);
        
        // 스테이지별 기본 설정 (스테이지가 높을수록 어려워짐)
        int stage = stageIdx.intValue();
        
        // 기본 제한시간: 60초 (스테이지가 높을수록 5초씩 감소, 최소 30초)
        int timeLimit = Math.max(30, 60 - (stage - 1) * 5);
        defaultConfig.setTimeLimit(timeLimit);
        
        // 기본 생명력: 3개 (스테이지 5 이상부터 1개씩 감소, 최소 1개)
        int initialLives = stage < 5 ? 3 : Math.max(1, 3 - (stage - 5));
        defaultConfig.setInitialLives(initialLives);
        
        // 오염물질 생성 주기: 2.0초 (스테이지가 높을수록 0.1초씩 감소, 최소 0.5초)
        double spawnRate = Math.max(0.5, 2.0 - (stage - 1) * 0.1);
        defaultConfig.setPollutantSpawnRate(spawnRate);
        
        // 최대 오염물질 수: 5개 (스테이지가 높을수록 1개씩 증가, 최대 10개)
        int maxPollutants = Math.min(10, 5 + (stage - 1));
        defaultConfig.setMaxPollutants(maxPollutants);
        
        // 난이도 배수: 1.0 (스테이지가 높을수록 0.1씩 증가)
        double difficultyMultiplier = 1.0 + (stage - 1) * 0.1;
        defaultConfig.setDifficultyMultiplier(difficultyMultiplier);
        
        // 목표 점수: 스테이지별로 증가
        Integer targetScore = 1000 * stage; // Long → Integer 변환
        defaultConfig.setTargetScore(targetScore);
        
        // 디버깅용 추가 로그
        log.info("=== 디버깅 정보 ===");
        log.info("stage: {}", stage);
        log.info("targetScore 계산값: {}", targetScore);
        log.info("defaultConfig.getTargetScore(): {}", defaultConfig.getTargetScore());
        log.info("==================");
        
        log.info("스테이지 {}의 기본 설정 생성: 시간={}초, 생명={}개, 생성주기={}초, 최대오염물질={}개, 난이도배수={}, 목표점수={}", 
                stageIdx, timeLimit, initialLives, spawnRate, maxPollutants, difficultyMultiplier, targetScore);
        
        return defaultConfig;
    }
} 