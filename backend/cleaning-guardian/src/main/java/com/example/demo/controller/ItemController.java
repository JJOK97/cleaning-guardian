package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ItemsDTO;
import com.example.demo.service.ItemService;

@RestController
@RequestMapping("/api/v1")
public class ItemController {

	@Autowired
	private ItemService itemService;

	@GetMapping("/items")
	public ResponseEntity<ItemsDTO> getAllItems() {
		ItemsDTO items = itemService.getAllItems();
		return new ResponseEntity<>(items, HttpStatus.OK);
	}

	@GetMapping("/items/{itemIdx}")
	public ResponseEntity<ItemsDTO> getItemsDetail(@PathVariable Long itemIdx) {
		ItemsDTO items = itemService.getItemsDetail(itemIdx);
		return new ResponseEntity<>(items, HttpStatus.OK);
	}

	/*
	 * @GetMapping("/skins") public ResponseEntity<ItemsDTO> getAllskins(){ ItemsDTO
	 * skins = itemservices.getAllskins(); return new ResponseEntity<>(items,
	 * HttpStatus.OK); }
	 */
}