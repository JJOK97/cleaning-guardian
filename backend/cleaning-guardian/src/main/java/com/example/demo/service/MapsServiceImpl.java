package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.MapsDTO;
import com.example.demo.mapper.MapsMapper;
import com.example.demo.vo.MapsVO;

@Service
public class MapsServiceImpl implements Mapsservice {

	@Autowired
	MapsMapper mapsMapper;

	@Override
	public MapsDTO getAllmaps() {
		List<MapsVO> maplist = mapsMapper.getAllmaps();

		if (maplist == null) {
			return MapsDTO.builder().success(false).message("맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("모든 맵을 불러옵니다.").maplist(maplist).build();
	}

	@Override
	public MapsDTO getClearedMaps(String email) {
		List<MapsVO> maplist = mapsMapper.getClearedMaps(email);

		if (email == null) {
			return MapsDTO.builder().success(false).message("사용자를 찾을 수 없습니다.").build();
		}
		if (maplist == null) {
			return MapsDTO.builder().success(false).message("사용자가 클리어한 맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().success(true).message("맵을 불러옵니다.").maplist(maplist).email(email).build();
	}

	@Override
	public MapsDTO getMap(long map_idx) {
		MapsVO map = mapsMapper.getMap(map_idx);

		if (map == null) {
			return MapsDTO.builder().success(false).message("해당 맵을 찾을 수 없습니다.").build();
		}

		return MapsDTO.builder().map(map).success(true).message("맵을 불러옵니다.").build();
	}

}
