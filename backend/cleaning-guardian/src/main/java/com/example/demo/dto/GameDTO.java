
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
	
	
	public List<GameVO> maps;
	public boolean success;
	public String message;
	public String email;

}
