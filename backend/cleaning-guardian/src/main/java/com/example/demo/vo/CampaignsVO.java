package com.example.demo.vo;

import java.sql.Timestamp;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Schema
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignsVO {

	 // 캠페인 식별자 
    private long campaignIdx;

    // 맵 식별자 
    private long mapIdx;

    // 캠페인 제목 
    private String campaignTitle;

    // 캠페인 설명 
    private String campaignDesc;

    // 캠페인 URL 
    private String campaignUrl;

    // 시작 일자 
    private Timestamp startedAt;

    // 종료 일자 
    private Timestamp closedAt;

    // 등록 일자 
    private Timestamp createdAt;
}
