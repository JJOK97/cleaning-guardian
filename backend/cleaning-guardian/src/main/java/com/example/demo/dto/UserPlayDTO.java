package com.example.demo.dto;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlayDTO {

	public long stageIdx;
	public boolean success;
	public String message;
	public String email;
	
}
