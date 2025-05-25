package com.example.demo.dto;

import lombok.Data;

@Data
public class CollectionDetailDTO {
    private Long polIdx;
    private String polName;
    private String polDesc;
    private String polImg1;
    private String polImg2;
    private String polImg3;
    private String type;
    private boolean isCollected;
    private String collectedAt;
} 