
package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.MapsVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {
	
	
	public List<MapsVO> maps;
	public boolean success;
	public String message;
	public String email;
	public long game_idx;
	public long map_idx;
	public long stage_idx;
	public long campaign_idx;

}
