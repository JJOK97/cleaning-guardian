package com.example.demo.vo;

import java.security.PrivateKey;

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
	
	
	//아이템명
	private String itemName; 
	
	//아이템 설명
	private String itemDesc; 
	
	//아이템 가격
	private long itemPrice; 
	
	//가격 타입
	private String priceType; 

}
