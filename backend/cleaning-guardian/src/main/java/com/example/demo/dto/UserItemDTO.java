package com.example.demo.dto;

import java.util.List;

import com.example.demo.vo.GameItemVO;
import com.example.demo.vo.UserItemVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserItemDTO {
    private boolean success;
    private String message;
    private Long userItemIdx;
    private String email;
    private Long itemIdx;
    private String itemType;
    private char isUsed;
    private Integer count;
    private LocalDateTime createdAt;
    private GameItemVO item;
    private List<UserItemVO> items;
} 