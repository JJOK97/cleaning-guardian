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
    private long gameIdx;

    // 게임 명 
    private String gameName;

    // 게임 내용 
    private String gameDesc;

    // 게임 장르 
    private String gameGenre;

    // 게임 플랫폼 
    private String gamePlatform;

    // 생성 일자 
    private Timestamp createdAt;

}
