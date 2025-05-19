
package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameDTO {

	public boolean success;
	public String message;
	public String email;
	public int map_idx;
	public int stage_idx;
	public int Campaign_idx;

}
