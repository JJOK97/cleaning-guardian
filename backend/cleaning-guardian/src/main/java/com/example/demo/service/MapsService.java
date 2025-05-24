package com.example.demo.service;

import java.util.Map;

import com.example.demo.dto.MapsDTO;

public interface MapsService {
	
	MapsDTO getAllmaps();

	MapsDTO getClearedMaps(String email);

	MapsDTO getMap(long map_idx);

	Map<String, Object> checkMapClear(long mapIdx, String email);
}
