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
public class GameVO {
	
	// 게임 식별자 
    private long game_idx;

    // 게임 명 
    private String game_name;

    // 게임 내용 
    private String game_desc;

    // 게임 장르 
    private String game_genre;

    // 게임 플랫폼 
    private String game_platform;

    // 생성 일자 
    private Timestamp created_at;

}
