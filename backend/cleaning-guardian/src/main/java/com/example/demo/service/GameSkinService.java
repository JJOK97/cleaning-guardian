package com.example.demo.service;

import com.example.demo.dto.GameSkinsDTO;

public interface GameSkinService {
	
	GameSkinsDTO getAllSkins();
	GameSkinsDTO getSkin(long skinIdx);

}
