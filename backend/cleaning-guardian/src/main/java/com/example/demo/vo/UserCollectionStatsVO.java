package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 사용자 수집 통계 VO
 * 
 * 게임 로직 개선을 위한 사용자별 오염물질 수집 통계:
 * - 오염물질별 처치 횟수, 획득 점수, 최고 콤보 등
 * - 게임 결과와 연동하여 실시간 업데이트
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCollectionStatsVO {
    
    /**
     * 통계 인덱스 (Primary Key)
     */
    private Long statsIdx;
    
    /**
     * 사용자 이메일 (Foreign Key)
     */
    private String email;
    
    /**
     * 오염물질 인덱스 (Foreign Key)
     */
    private Long polIdx;
    
    /**
     * 총 처치 횟수
     */
    private Integer totalDefeated;
    
    /**
     * 총 획득 점수
     */
    private Long totalScore;
    
    /**
     * 평균 획득 점수
     */
    private Double averageScore;
    
    /**
     * 최고 점수 (한 번에 획득한 최고 점수)
     */
    private Integer maxScore;
    
    /**
     * 최고 콤보 (해당 오염물질로 달성한 최고 콤보)
     */
    private Integer maxCombo;
    
    /**
     * 첫 처치 일시
     */
    private LocalDateTime firstDefeatedAt;
    
    /**
     * 최근 처치 일시
     */
    private LocalDateTime lastDefeatedAt;
    
    /**
     * 생성 일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 수정 일시
     */
    private LocalDateTime updatedAt;
    
    /**
     * 오염물질 이름 (조인된 정보)
     */
    private String pollutionName;
    
    /**
     * 오염물질 이미지 (조인된 정보)
     */
    private String pollutionImage;
    
    /**
     * 오염물질 타입 (조인된 정보)
     */
    private String pollutionType;
    
} 