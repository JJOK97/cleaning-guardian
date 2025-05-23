package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.MissionsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissionClearDTO {

	private List<MissionsVO> missionsList;
	private MissionsVO mission;
	private boolean success;
	private String message;
}
