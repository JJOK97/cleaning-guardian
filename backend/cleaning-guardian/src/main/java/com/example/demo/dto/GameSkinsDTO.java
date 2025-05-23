package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.GameSkinsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameSkinsDTO {
	
	private List<GameSkinsVO> skinList;
    private boolean success;
    private String message; 
    private GameSkinsVO skin;

}
