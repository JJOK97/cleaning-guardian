package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.UserSkinVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkinDTO {

	public List<UserSkinVO> userSkinList;
	public UserSkinVO userSkin;
	public boolean success;
	public String message;
	public String email;
	public long skinIdx;
}
