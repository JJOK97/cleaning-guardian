package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.dto.ItemsDTO;
import com.example.demo.dto.SkinsDTO;
import com.example.demo.mapper.ItemMapper;
import com.example.demo.mapper.SkinMapper;
import com.example.demo.vo.SkinsVO;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkinServiceImpl implements SkinService {
	
	private final SkinMapper skinMapper;
	
	@Override
	public SkinsDTO getAllSkins() {
		List<SkinsVO> skinList = skinMapper.getAllSkins();
		
		if(skinList == null) {
			 return SkinsDTO.builder().success(false).message("스킨을 찾을 수 없습니다.").build();
		}
		return SkinsDTO.builder().success(true).message("성공").skinList(skinList).build();
    }
	
	 @Override
    public SkinsDTO getSkinsDetail(long skinIdx) {
        if (skinIdx <= 0) {
            return SkinsDTO.builder().success(false).message("skinIdx가 유효하지 않습니다.").build();
        }

        SkinsVO skin = skinMapper.getSkinsDetail(skinIdx);

        if (skin == null) {
            return SkinsDTO.builder().success(false).message("해당 skinIdx에 대한 아이템이 없습니다.").build();
        }

        return SkinsDTO.builder().success(true).message("스킨 조회 성공").skin(skin).build();
    }
	
	}