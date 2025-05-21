package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameClearVO {

	
	private long gclearIdx;
	
	private String email;
	
	private long stageIdx;
	
	private String successYn;
	
	private Timestamp createdAt;
}
