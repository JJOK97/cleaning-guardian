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
public class GameSkinVO {
    private Long skinIdx;
    private Long gameIdx;
    private String skinName;
    private String skinDesc;
    private String skinImg;
    private Long skinPrice;
    private String actionType;
    private LocalDateTime createdAt;
} 