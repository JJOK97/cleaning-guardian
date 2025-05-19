package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StageDTO {

	public boolean success;
	public String message;
	public String email;
	public int stage_idx;
	
	
	
}
