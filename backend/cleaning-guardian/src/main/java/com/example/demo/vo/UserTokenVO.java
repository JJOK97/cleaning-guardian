package com.example.demo.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTokenVO {
	private Long tokenIdx;
	private String email;
	private String deviceId;
	private String accessToken;
	private LocalDateTime createdAt;
	private LocalDateTime expiredAt;
	private char isValid;
}