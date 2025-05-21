package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.StagesVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StageDTO {

	public List<StagesVO> stagelist;
	public StagesVO stage;
	public boolean success;
	public String message;
	public String email;

}
