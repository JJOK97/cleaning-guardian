package com.example.demo.dto;



import java.util.List;

import com.example.demo.vo.StagePolutionsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StagePollutionsDTO {

	public List<StagePolutionsVO> splist;
	public StagePolutionsVO sp;
	public boolean success;
	public String message;
	public String email;
}
