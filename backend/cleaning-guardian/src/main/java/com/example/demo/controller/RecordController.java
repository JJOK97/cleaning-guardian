package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RecordDTO;
import com.example.demo.service.RecordServiceImpl;


@RestController
@RequestMapping("/api/v1")
public class RecordController {
	
	@Autowired
	RecordServiceImpl recordService;

	// 오염 제거 통계 업데이트
	@PostMapping("/users/me/record")
	public ResponseEntity<RecordDTO> postRecord(@RequestParam("email") String email) {
		RecordDTO record = recordService.postRecord(email);
		return new ResponseEntity<>(record, HttpStatus.OK);
	}
	
}
