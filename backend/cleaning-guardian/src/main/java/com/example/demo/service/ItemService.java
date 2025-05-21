package com.example.demo.service;

import org.springframework.http.ResponseEntity;

import com.example.demo.dto.ItemsDTO;

public interface ItemService {
	
	ItemsDTO getAlluserItems();
	ItemsDTO getUserItemsDetail(long itemIdx);

}
