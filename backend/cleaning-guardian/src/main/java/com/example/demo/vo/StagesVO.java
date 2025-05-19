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
    private long stage_idx;

    // 맵 식별자 
    private long map_idx;

    // 스테이지 이름 
    private String stage_name;

    // 스테이지 미션 
    private String stage_mission;

    // 마지막 스테이지 여부 
    private String is_final_stage;

    // 스테이지 스텝 
    private long stage_step;

    // 생성 일자 
    private Timestamp created_at;
}
