package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.service.GameItemService;

@RestController
@RequestMapping("/api/v1")
public class GameItemController {

	@Autowired
	private GameItemService gameItemService;

	@GetMapping("/items")
	public ResponseEntity<GameItemsDTO> getAllItems() {
		GameItemsDTO items = gameItemService.getAllItems();
		return new ResponseEntity<>(items, HttpStatus.OK);
	}

	@GetMapping("/items/{itemIdx}")
	public ResponseEntity<GameItemsDTO> getItem(@PathVariable Long itemIdx) {
		GameItemsDTO items = gameItemService.getItem(itemIdx);
		return new ResponseEntity<>(items, HttpStatus.OK);
	}

	/*
	 * @GetMapping("/skins") public ResponseEntity<ItemsDTO> getAllskins(){ ItemsDTO
	 * skins = itemservices.getAllskins(); return new ResponseEntity<>(items,
	 * HttpStatus.OK); }
	 */
}