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
public class UserItemVO {
	private Long userItemIdx;
	private String email;
	private Long itemIdx;
	private String itemType;
	private char isUsed;
	private LocalDateTime createdAt;
	private Integer count;
	
	// 아이템 상세 정보
	private GameItemVO item;
}
