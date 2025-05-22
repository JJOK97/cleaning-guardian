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
public class UserPlayVO {

	private long playIdx;
	private String email;
	private long spIdx;
	private Timestamp createdAt;
}
