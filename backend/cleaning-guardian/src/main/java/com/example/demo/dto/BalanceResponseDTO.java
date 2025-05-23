package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponseDTO {
    private boolean success;
    private String message;
    private String email;
    private long point; // 포인트 잔액
    private long cash;  // 캐시 잔액
}