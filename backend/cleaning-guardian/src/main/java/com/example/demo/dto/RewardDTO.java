package com.example.demo.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardDTO {

	private boolean success;
	private String message;
	private String email;
	private List<RewardDetail> rewards;  // 여러 보상을 한번에 처리하기 위한 리스트

}
