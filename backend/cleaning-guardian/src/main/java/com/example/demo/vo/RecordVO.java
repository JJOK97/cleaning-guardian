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
public class RecordVO {
	
	private long upIdx;
	private long playIdx;
	private long polIdx;
	private Timestamp createdAt;
	private long count;

}
