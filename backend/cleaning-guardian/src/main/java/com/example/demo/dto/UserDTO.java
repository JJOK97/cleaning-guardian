package com.example.demo.dto;

import java.sql.Timestamp;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    
	// 이메일 
    private String email;

    // 비밀번호 
    private String password;

    // 닉네임 
    private String nickname;

    // 생성일 
    private Timestamp joinedAt;


}