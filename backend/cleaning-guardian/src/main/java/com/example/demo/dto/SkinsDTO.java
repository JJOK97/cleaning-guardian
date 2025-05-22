package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.SkinsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkinsDTO {
	
	private List<SkinsVO> skinList;
    private boolean success;
    private String message; 
    private SkinsVO skin;

}
