package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuizDTO;
import com.example.demo.service.QuizServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class QuizController {

	@Autowired
	QuizServiceImpl quizService;

	// 랜덤한 퀴즈 Idx 가져오기
	@GetMapping("/quizzes")
	public ResponseEntity<QuizDTO> getRandomQuiz() {
	    QuizDTO quiz = quizService.getRandomQuiz();
	    return new ResponseEntity<>(quiz, HttpStatus.OK);
	}

}
