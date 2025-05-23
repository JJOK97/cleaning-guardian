package com.example.demo.dto;

import com.example.demo.vo.QuizVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {

	private QuizVO quiz;
	private String message;
	private boolean success;

}
