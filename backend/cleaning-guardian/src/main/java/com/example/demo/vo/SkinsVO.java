package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkinsVO {

	// 스킨 식별자
	private long skinIdx;

	// 게임 식별자
	private long gameIdx;

	// 스킨명
	private String skinName;

	// 스킨 설명
	private String skinDesc;

	// 스킨 가격
	private long skinPrice;

	// 스킨이미지
	private String skinImg;

	// 액션타입
	private String actionType;

}
