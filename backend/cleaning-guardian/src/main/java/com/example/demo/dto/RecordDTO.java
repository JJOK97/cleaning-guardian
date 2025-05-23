package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.RecordVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordDTO {

	private List<RecordVO> recordList;
	private RecordVO record;
	private boolean success;
	private String message;

}
