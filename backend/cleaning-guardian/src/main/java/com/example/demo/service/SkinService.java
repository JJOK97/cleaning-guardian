package com.example.demo.service;

import com.example.demo.dto.SkinsDTO;

public interface SkinService {
	
	SkinsDTO getAllSkins();
	SkinsDTO getSkinsDetail(long skinIdx);

}
