package com.example.demo.dto;

import java.sql.Timestamp;

import com.example.demo.vo.GameClearVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameClearDTO {
	
	
	public GameClearVO gameClear;
	public boolean success;
	public String message;
	public String email;

    // 맵 식별자 
    public long mapIdx;

    // 스테이지 식별자 
    public long stageIdx;
	
	// 게임 클리어 여부
    public String successYn;
	
    // 타임 스탬프
    public Timestamp createdAt;
}
