package com.example.demo.service;

import com.example.demo.dto.GameItemsDTO;

public interface GameItemService {
	
	GameItemsDTO getAllItems();
	GameItemsDTO getItem(long itemIdx);

}
