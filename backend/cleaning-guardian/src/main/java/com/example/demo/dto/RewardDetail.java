package com.example.demo.dto;

import com.example.demo.enums.RewardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardDetail {
    private RewardType type;     // 보상 타입 (POINT, CASH, ITEM)
    private int value;           // 보상 수량
    private Long itemIdx;        // 아이템인 경우 아이템 ID
} 