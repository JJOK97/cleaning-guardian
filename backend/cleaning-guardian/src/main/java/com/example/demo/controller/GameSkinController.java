package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GameSkinsDTO;
import com.example.demo.service.GameSkinService;

@RestController
@RequestMapping("/api/v1")
public class GameSkinController {

	@Autowired
	private GameSkinService skinService;

	// 전체 스킨 조회
	@GetMapping("/skins")
	public ResponseEntity<GameSkinsDTO> getAllSkins() {
		GameSkinsDTO skins = skinService.getAllSkins();
		return new ResponseEntity<>(skins, HttpStatus.OK);
	}

	// 단일 스킨 상세 내용 조회
	@GetMapping("/skins/{skinsIdx}")
	public ResponseEntity<GameSkinsDTO> getSkin(@PathVariable("skinsIdx") Long skinIdx) {
		GameSkinsDTO skins = skinService.getSkin(skinIdx);
		return new ResponseEntity<>(skins, HttpStatus.OK);
	}

}
