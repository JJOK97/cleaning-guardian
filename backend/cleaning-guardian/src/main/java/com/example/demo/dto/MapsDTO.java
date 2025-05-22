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
public class MapsDTO {

	private MapsVO map;
	private List<MapsVO> maplist;
	private boolean success;
	private String message;
	private String email;

}
