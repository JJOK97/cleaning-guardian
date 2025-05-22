package com.example.demo.service;

import com.example.demo.dto.MapsDTO;

public interface Mapsservice {
	
	MapsDTO getAllmaps();

	MapsDTO getClearedMaps(String email);

	MapsDTO getMap(long map_idx);
}
