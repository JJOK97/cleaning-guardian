package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.MapsVO;
import com.example.demo.vo.ProfilesVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilesDTO {

	public List<ProfilesVO> profilesList;
	public ProfilesVO profile;
	public boolean success;
	public String message;
	public String email;
}
