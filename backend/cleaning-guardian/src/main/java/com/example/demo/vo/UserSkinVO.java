package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSkinVO {

	// 사용자 스킨 식별자
	private long uskinIdx;

	// 사용자 이메일
	private String email;

	// 스킨 식별자
	private long skinIdx;

	// 스킨 획득 구분
	private String getType;

	// 등록 일자
	private Timestamp createdAt;

}
