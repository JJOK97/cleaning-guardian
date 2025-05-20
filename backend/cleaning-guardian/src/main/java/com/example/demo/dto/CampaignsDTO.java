package com.example.demo.dto;


import java.util.List;

import com.example.demo.vo.CampaignsVO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Schema
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignsDTO {
    private CampaignsVO campaign;
    private List<CampaignsVO> campaignlist;
    private boolean success;
    private String message;
}
