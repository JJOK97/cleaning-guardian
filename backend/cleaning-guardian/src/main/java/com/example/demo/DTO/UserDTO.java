package com.example.demo.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String userLoginId;     // 자동 생성 로그인 아이디
    // private String password;   이건 보류. 자동 로그인.
    private String nickname;        // 사용자 입력값 받을 닉네임.
    
	public String getUserLoginId() {
		return userLoginId;
	}
	public void setUserLoginId(String userLoginId) {
		this.userLoginId = userLoginId;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
    
}