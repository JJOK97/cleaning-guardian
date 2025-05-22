package com.example.demo.service;

import com.example.demo.dto.StagePollutionsDTO;
import com.example.demo.dto.UserPlayDTO;

public interface GameService {

	UserPlayDTO gameStart(String email, long stageIdx);

	StagePollutionsDTO getStagePollutions(long stageIdx);

}
