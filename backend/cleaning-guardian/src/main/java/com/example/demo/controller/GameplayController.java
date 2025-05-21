//package com.example.demo.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.dto.StagesDTO;
//import com.example.demo.service.GameplayService;
//
//
//@RestController
//@RequestMapping("/api/v1")
//public class GameplayController {
//
//	@Autowired
//	GameplayService GameplayService;
//	
//	// 스킨 설정
//	
//	// 스테이지 완료 처리
//	
//	// 스테이지 상태 조회
//	@GetMapping("/stages/{stageIdx}/status")
//	public  ResponseEntity<List<StagesDTO>> stageStatus() {
//		
//		return GameplayService.getstageStatus();
//	
//	
//}
