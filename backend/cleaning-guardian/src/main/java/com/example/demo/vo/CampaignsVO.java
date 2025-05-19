package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignsVO {

	 // 캠페인 식별자 
    private Double campaign_idx;

    // 맵 식별자 
    private Double map_idx;

    // 캠페인 제목 
    private String campaign_title;

    // 캠페인 설명 
    private String campaign_desc;

    // 캠페인 URL 
    private String campaign_url;

    // 시작 일자 
    private Timestamp started_at;

    // 종료 일자 
    private Timestamp closed_at;

    // 등록 일자 
    private Timestamp created_at;
}
