package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.PollutionsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollutionsDTO {

	private List<PollutionsVO> pollutionsList;
	private PollutionsVO pollution;
	private boolean success;
	private String message;
}
