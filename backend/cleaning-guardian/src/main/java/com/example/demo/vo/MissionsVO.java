package com.example.demo.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissionsVO {

	private long missionIdx;
	private String missionName;
	private String missionDesc;
	private long rewardSkin;
	private long rewardItem;
	private Timestamp createdAt;
}
