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

	public MapsVO map;
	public List<MapsVO> maplist;
    public boolean success;
	public String message;
	public String email;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
