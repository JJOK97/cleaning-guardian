package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.QuizDTO;
import com.example.demo.mapper.QuizMapper;
import com.example.demo.vo.QuizVO;

@Service
public class QuizServiceImpl implements QuizService {
	
	@Autowired
	QuizMapper quizMapper;
	
	// 랜덤 퀴즈 로직 구현
	@Override
	public QuizDTO getRandomQuiz() {
	    QuizVO quiz = quizMapper.getRandomQuiz();

	    if (quiz == null) {
	        return QuizDTO.builder()
	                .success(false)
	                .message("랜덤 퀴즈를 찾을 수 없습니다.")
	                .build();
	    }

	    return QuizDTO.builder()
	            .success(true)
	            .message("랜덤 퀴즈를 불러왔습니다.")
	            .quiz(quiz)
	            .build();
	}

	
	

}
