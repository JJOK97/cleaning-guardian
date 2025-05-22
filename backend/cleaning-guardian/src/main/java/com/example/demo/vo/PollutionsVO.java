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
public class PollutionsVO {

	private long polIdx;
	private long gameIdx;
	private String polName;
	private String polDesc;
	private String polImg1;
	private String polImg2;
	private String polImg3;
	private String type;
	private Timestamp createdAt;
	
}
