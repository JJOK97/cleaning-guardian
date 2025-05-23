package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RecordDTO;
import com.example.demo.mapper.RecordMapper;

@Service
public class RecordServiceImpl implements RecordService {

	@Autowired
	RecordMapper recordMapper;

	public RecordDTO postRecord(String email) {
		int record = recordMapper.postRecord(email);

		if (record == 0) {
			return RecordDTO.builder().success(false).message("기록을 갱신할 수 없습니다.").build();
		}

		return RecordDTO.builder().success(true).message("기록을 갱신.").build();
	}

}
