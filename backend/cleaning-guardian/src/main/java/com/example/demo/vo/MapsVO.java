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
public class MapsVO {
	
	// 맵 식별자 
    private long mapIdx;

    // 게임 식별자 
    private long gameIdx;

    // 맵 이름 
    private String mapTitle;

    // 맵 설명 
    private String mapDesc;

    // 맵 테마 
    private String mapTheme;

    // 생성 일자 
    private Timestamp createdAt;
}

