package com.example.demo.service;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.UserSkinDTO;

public interface GamePlayService {

	GameClearDTO stageClear(long skinIdx, String email, String successYn);

	UserSkinDTO patchSkin(long skinIdx, String email);

}
