package com.example.demo.service;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.UserPlayDTO;

public interface GameService {

	UserPlayDTO gameStart(String email, long stageIdx);

	PollutionsDTO getStagePollutions(long stageIdx);

	PollutionsDTO getAllPollutions();

}
