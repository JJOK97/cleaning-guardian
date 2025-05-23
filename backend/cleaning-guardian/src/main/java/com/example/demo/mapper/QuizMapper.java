package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.QuizVO;

@Mapper
public interface QuizMapper {
	
	QuizVO getRandomQuiz();

	
}
