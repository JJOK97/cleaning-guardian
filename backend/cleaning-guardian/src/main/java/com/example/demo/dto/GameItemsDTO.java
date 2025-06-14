package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.GameItemVO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameItemsDTO {
	
    private boolean success;
    private String message;
    private List<GameItemVO> items;
    private GameItemVO item;
}

	
	
	


