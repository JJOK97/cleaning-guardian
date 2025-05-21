package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDTO {
    private boolean success;
    private String message;
    private String email;
    private String nickname;
    private LocalDateTime joinedAt;
    private long profileIdx;
}