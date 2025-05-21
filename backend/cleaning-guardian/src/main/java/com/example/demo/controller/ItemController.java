package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ItemsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.service.ItemServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class ItemController {
	
	@Autowired private ItemServiceImpl itemservices;
	
	@GetMapping("/items") 
	public ResponseEntity<ItemsDTO> getAlluserItems(){ 
		ItemsDTO items = itemservices.getAlluserItems();
	return new ResponseEntity<>(items, HttpStatus.OK);
	}
	
	@GetMapping("/items/{itemIdx}") 
	public ResponseEntity<ItemsDTO> getUserItemsDetail(@PathVariable Long itemIdx){ 
		ItemsDTO items = itemservices.getUserItemsDetail(itemIdx);
	return new ResponseEntity<>(items, HttpStatus.OK);
	}
		
}