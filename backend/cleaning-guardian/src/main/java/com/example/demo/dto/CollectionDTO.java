package com.example.demo.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CollectionDTO {
    private List<PollutionDTO> pollutions;
    private int totalCount;
    private int collectedCount;
    private double completionRate;
    private List<UserCollectionDetailDTO> userCollections;
    
    @Data
    @Builder
    public static class PollutionDTO {
        private Long polIdx;
        private String polName;
        private String polDesc;
        private String polImg1;
        private String polImg2;
        private String polImg3;
        private String type;
        private boolean isCollected;
        private int collectionCount;
    }

    @Data
    @Builder
    public static class UserCollectionDetailDTO {
        private Long polIdx;
        private String polName;
        private String polImg1;
        private String type;
        private String collectedAt;
    }
} 