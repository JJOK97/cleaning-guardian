package com.example.demo.vo;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class UserCollectionVO {
    private Long collectionIdx;
    private String email;
    private Long polIdx;
    private Timestamp collectedAt;
} 