package com.example.demo.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSkinDTO {

	// 사용자 스킨 식별자 
    private Double uskin_idx;

    // 사용자 이메일 
    private String email;

    // 스킨 식별자 
    private Double skin_idx;

    // 스킨 획득 구분 
    private String get_type;

    // 등록 일자 
    private Timestamp created_at;
    
}
