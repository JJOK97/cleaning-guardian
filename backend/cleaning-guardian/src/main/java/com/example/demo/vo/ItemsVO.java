package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemsVO {
	
	
	//유저 식별자
	private long userItemIdx;
	
	//이메일
	private String email;
	
	//아이템 식별자
	private long itemIdx;

	//아이템 타입 
	private String itemType;
	
	//사용여부
	private String isUsed;
	
	//생성일자
	private String createdAt;

}
