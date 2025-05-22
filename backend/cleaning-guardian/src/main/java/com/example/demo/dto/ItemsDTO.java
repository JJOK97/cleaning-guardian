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
public class ItemsDTO {
	
    private List<GameItemVO> itemlist;
    private boolean success;
    private String message; 
    private GameItemVO item;
}

	
	
	


