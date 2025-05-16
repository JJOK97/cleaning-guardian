package com.example.demo.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MapsDTO {
	
	// 맵 식별자 
    private Double map_idx;

    // 게임 식별자 
    private Double game_idx;

    // 맵 이름 
    private String map_title;

    // 맵 설명 
    private String map_desc;

    // 맵 테마 
    private String map_theme;

    // 생성 일자 
    private Timestamp created_at;
}
