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

	private List<UserSkinVO> userSkinList;
	private UserSkinVO userSkin;
	private boolean success;
	private String message;
	private String email;
	private long skinIdx;
}
