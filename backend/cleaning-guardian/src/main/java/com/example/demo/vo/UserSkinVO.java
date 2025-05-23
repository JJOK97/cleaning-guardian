package com.example.demo.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkinVO {

	// 사용자 스킨 식별자
	private Long uskinIdx;

	// 사용자 이메일
	private String email;

	// 스킨 식별자
	private Long skinIdx;

	// 스킨 획득 구분
	private String getType;

	// 등록 일자
	private LocalDateTime createdAt;

	private String isEquipped;

	private GameSkinVO skin;  // 스킨 상세 정보

}
