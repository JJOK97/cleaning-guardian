package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MapsDTO;
import com.example.demo.service.MapsServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class MapsController {

	@Autowired
	MapsServiceImpl mapService;

	// 모든 맵 가져오기
	@GetMapping("/maps")
	public ResponseEntity<MapsDTO> getAllmaps() {
		MapsDTO maps = mapService.getAllmaps();
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}

	// 클리어한 모든 맵 가져오기
	@GetMapping("/maps/cleared")
	public ResponseEntity<MapsDTO> getClearedMaps(@RequestParam("email") String email) {
		MapsDTO maps = mapService.getClearedMaps(email);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}
	
	// 선택한 맵 가져오기
	@GetMapping("/maps/{mapIdx}")
	public ResponseEntity<MapsDTO> mapJoin(@PathVariable("mapIdx") long map_idx) {
		MapsDTO maps = mapService.getMap(map_idx);
		return new ResponseEntity<>(maps, HttpStatus.OK);
	}

	// 맵 클리어 상태 체크
	@GetMapping("/maps/{mapIdx}/clear-check")
	public ResponseEntity<?> checkMapClear(
			@PathVariable("mapIdx") long mapIdx,
			@RequestParam("email") String email) {
		return new ResponseEntity<>(mapService.checkMapClear(mapIdx, email), HttpStatus.OK);
	}
}
