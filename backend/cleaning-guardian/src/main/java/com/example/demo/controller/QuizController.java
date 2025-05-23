package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuizDTO;
import com.example.demo.service.QuizServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class QuizController {

	@Autowired
	QuizServiceImpl quizService;
	
	
	//퀴즈인덱스 안 불러와지는 이슈!! 
	@GetMapping("/quizzes")
	public ResponseEntity<QuizDTO> getRandomQuiz() {
	    QuizDTO quiz = quizService.getRandomQuiz();
	    return ResponseEntity.ok(quiz);
	}


}
