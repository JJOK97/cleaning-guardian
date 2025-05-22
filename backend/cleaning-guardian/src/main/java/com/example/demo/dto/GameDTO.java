
package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.GameVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {
	
	
	private List<GameVO> maps;
	private boolean success;
	private String message;
	private String email;

}
