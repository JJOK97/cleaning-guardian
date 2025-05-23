package com.example.demo.vo;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizVO {
	
	//퀴즈 식별자 
	private long quiz_Idx;
	//퀴즈 문제
	private String quizDesc;
	//퀴즈 정답
	private String quizAnswer;

}
