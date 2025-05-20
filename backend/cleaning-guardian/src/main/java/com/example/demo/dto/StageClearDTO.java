package com.example.demo.dto;

import java.sql.Timestamp;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StageClearDTO {
	
	public boolean success;
	public String message;
	public String email;

	// 스테이지 식별자 
    public long stageIdx;

    // 맵 식별자 
    public long mapIdx;

    // 스테이지 이름 
    public String stageName;

    // 스테이지 미션 
    public String stageMission;

    // 마지막 스테이지 여부 
    public String isFinalStage;

    // 스테이지 스텝 
    public long stageStep;

    // 생성 일자 
    public Timestamp createdAt;
}
