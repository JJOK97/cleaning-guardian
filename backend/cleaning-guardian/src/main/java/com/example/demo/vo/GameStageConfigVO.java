package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 스테이지별 게임 설정 VO
 * 
 * 게임 로직 개선을 위한 스테이지별 게임 설정 정보:
 * - 제한 시간, 초기 생명력, 오염물질 생성 주기 등
 * - 스테이지별로 다른 게임 난이도와 설정 적용
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameStageConfigVO {
    
    /**
     * 설정 인덱스 (Primary Key)
     */
    private Long configIdx;
    
    /**
     * 스테이지 인덱스 (Foreign Key)
     */
    private Long stageIdx;
    
    /**
     * 게임 인덱스 (Foreign Key)
     */
    private Long gameIdx;
    
    /**
     * 제한 시간 (초)
     * 기본값: 60초
     */
    private Integer timeLimit;
    
    /**
     * 초기 생명력 개수
     * 기본값: 3개
     */
    private Integer initialLives;
    
    /**
     * 오염물질 생성 주기 (초)
     * 기본값: 2.0초
     */
    private Double pollutantSpawnRate;
    
    /**
     * 최대 동시 오염물질 수
     * 기본값: 5개
     */
    private Integer maxPollutants;
    
    /**
     * 난이도 배수
     * 점수, 속도 등에 적용되는 전체적인 난이도 배수
     * 기본값: 1.0
     */
    private Double difficultyMultiplier;
    
    /**
     * 목표 점수 (스테이지 클리어 조건)
     * null인 경우 시간 내 생존이 목표
     */
    private Integer targetScore;
    
    /**
     * 생성 일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 수정 일시
     */
    private LocalDateTime updatedAt;
    
} 