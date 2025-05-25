package com.example.demo.dto;

import java.util.List;
import lombok.Data;

@Data
public class CollectionDTO {
    private List<PollutionDTO> pollutions;
    private int totalCount;
    private int collectedCount;
    private double completionRate;
    
    @Data
    public static class PollutionDTO {
        private Long polIdx;
        private String polName;
        private String polDesc;
        private String polImg1;
        private String polImg2;
        private String polImg3;
        private String type;
        private boolean isCollected;
    }
} 