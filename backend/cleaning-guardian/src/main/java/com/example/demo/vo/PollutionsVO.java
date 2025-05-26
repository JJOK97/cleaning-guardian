package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 오염물질 정보 VO
 * 
 * 게임 로직 개선을 위해 추가된 필드들:
 * - baseScore: 기본 점수 (처치 시 획득 점수)
 * - moveSpeed: 이동 속도 (물리 엔진 적용 시 사용)
 * - sizeMultiplier: 크기 배수 (오염물질 크기 조절)
 * - spawnWeight: 생성 가중치 (출현 확률 조절)
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollutionsVO {

	private long polIdx;
	private long gameIdx;
	private String polName;
	private String polDesc;
	private String polImg1;
	private String polImg2;
	private String polImg3;
	private String type;
	private Timestamp createdAt;
	private int count;
	
	// ===== 게임 로직 개선을 위한 새로운 필드들 =====
	
	/**
	 * 기본 점수 - 오염물질 처치 시 획득하는 기본 점수
	 * DB 기본값: 100
	 */
	private Integer baseScore;
	
	/**
	 * 이동 속도 - 게임 내에서 오염물질의 이동 속도 배수
	 * DB 기본값: 1.0 (기본 속도)
	 */
	private Double moveSpeed;
	
	/**
	 * 크기 배수 - 오염물질의 크기 조절 배수
	 * DB 기본값: 1.0 (기본 크기)
	 */
	private Double sizeMultiplier;
	
	/**
	 * 생성 가중치 - 스테이지에서 해당 오염물질이 생성될 확률 가중치
	 * DB 기본값: 1 (동일한 확률)
	 * 높을수록 더 자주 생성됨
	 */
	private Integer spawnWeight;
	
}
