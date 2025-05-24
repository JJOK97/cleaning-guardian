package com.example.demo.enums;

public enum RewardType {
    POINT("포인트"),
    CASH("캐시"),
    ITEM("아이템");

    private final String description;
    
    RewardType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 