package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignsDTO {

	public boolean success;
	public String message;
	public String email;
	public int Campaign_idx;
	
	
	
}
