package com.example.demo.service;

import com.example.demo.dto.ItemsDTO;

public interface ItemService {
	
	ItemsDTO getAllItems();
	ItemsDTO getItemsDetail(long itemIdx);

}
