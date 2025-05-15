package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.GameDTO;
import com.example.demo.Service.GameService;

@RestController
@RequestMapping("/api/main")
public class GameController {

	GameDTO game = new GameDTO();
	
	@Autowired
	GameService gameservice;
	
	@PostMapping("/start")
	public String gamestart() {
		return "메인화면 시작";
	}
	
	@GetMapping("/select")
	public String gameselect() {
		return "지역선택 시작";
	}
	
	@PostMapping("/join")
	public String gamejoin() {
		return "맵 입장";
	}
	
	
	
	
	
	
	
	
	
}
