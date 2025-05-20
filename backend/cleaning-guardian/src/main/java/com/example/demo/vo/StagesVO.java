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
public class StagesVO {

	// 스테이지 식별자 
    private long stageIdx;

    // 맵 식별자 
    private long mapIdx;

    // 스테이지 이름 
    private String stageName;

    // 스테이지 미션 
    private String stageMission;

    // 마지막 스테이지 여부 
    private String isFinalStage;

    // 스테이지 스텝 
    private long stageStep;

    // 생성 일자 
    private Timestamp createdAt;
}
