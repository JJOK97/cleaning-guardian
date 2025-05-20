package com.example.demo.dto;


import java.util.List;

import com.example.demo.vo.MapsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapsDTO {

	public List<MapsVO> maps;
	public boolean success;
	public String message;
	public String email;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
