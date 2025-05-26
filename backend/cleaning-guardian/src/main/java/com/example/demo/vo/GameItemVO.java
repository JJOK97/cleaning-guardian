package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 게임 아이템 정보 VO
 * 
 * 게임 로직 개선을 위해 추가된 필드들:
 * - effectType: 아이템 효과 타입 (SCORE_BOOST, TIME_EXTEND, LIFE_BOOST, COMBO_BOOST, SLOW_TIME)
 * - effectValue: 효과 수치 (배수, 증가량 등)
 * - effectDuration: 효과 지속 시간 (초 단위, null이면 영구 효과)
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameItemVO {
    
	private Long itemIdx;
    
    private Long gameIdx;
    
    private String itemName;
    
    private String itemDesc;
    
    private String itemImg;
    
    private Long itemPrice;
    
    private String priceType;
    
    private LocalDateTime createdAt;

    // ===== 게임 로직 개선을 위한 새로운 필드들 =====
    
    /**
     * 아이템 효과 타입
     * - SCORE_BOOST: 점수 증가 효과
     * - TIME_EXTEND: 시간 연장 효과
     * - LIFE_BOOST: 생명력 증가 효과
     * - COMBO_BOOST: 콤보 점수 증가 효과
     * - SLOW_TIME: 시간 감속 효과
     */
    private String effectType;
    
    /**
     * 효과 수치
     * - SCORE_BOOST: 점수 배수 (예: 1.5 = 1.5배)
     * - TIME_EXTEND: 연장 시간 (초)
     * - LIFE_BOOST: 증가 생명력 개수
     * - COMBO_BOOST: 콤보 점수 배수
     * - SLOW_TIME: 시간 감속 배수 (예: 0.5 = 절반 속도)
     */
    private Double effectValue;
    
    /**
     * 효과 지속 시간 (초 단위)
     * null인 경우 게임 전체에 적용되는 영구 효과
     * 값이 있는 경우 해당 시간 동안만 적용되는 임시 효과
     */
    private Integer effectDuration;

}
