package com.example.demo.vo;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class PollutionVO {
    private Long polIdx;
    private Long gameIdx;
    private String polName;
    private String polDesc;
    private String polImg1;
    private String polImg2;
    private String polImg3;
    private String type;
    private Timestamp createdAt;
} 