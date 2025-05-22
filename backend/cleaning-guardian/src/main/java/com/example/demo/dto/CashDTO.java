package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
 public class CashDTO {
    private Long userId;
    private Integer amount;
    private String currencyType;
    private Boolean success;
    private String message;
}
