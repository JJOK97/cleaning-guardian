package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameClearDTO {
	
	
	private boolean success;
	private String message;
	private String email;
	private long stageIdx;
	private String successYn;
}
