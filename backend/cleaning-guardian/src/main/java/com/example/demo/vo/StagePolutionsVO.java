package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StagePolutionsVO {

	private long spIdx;
	
	private long stageIdx;
	
	private long polIdx;
	
	private Timestamp createdAt;
	
	
	
	
	
}
