package com.example.demo.service;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.dto.UserItemDTO;

public interface GameItemService {
	
	// 모든 아이템 목록 조회
	GameItemsDTO getAllItems();
	
	// 사용자가 보유한 아이템 목록 조회
	UserItemDTO getUserItems(String email);
	
	// 아이템 구매
	UserItemDTO purchaseItem(String email, Long itemIdx);
	
	// 아이템 사용
	UserItemDTO useItem(String email, Long itemIdx);

	// 포인트 아이템 목록 조회
	GameItemsDTO getPointItems();

	// 캐시 아이템 목록 조회
	GameItemsDTO getCashItems();

}
