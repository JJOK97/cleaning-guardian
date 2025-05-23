package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.mapper.GameItemMapper;
import com.example.demo.vo.GameItemVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameItemServiceImpl implements GameItemService {

	private final GameItemMapper itemMapper;

	@Override
	public GameItemsDTO getAllItems() {
		List<GameItemVO> itemList = itemMapper.getAllItems();

		if (itemList == null) {
			return GameItemsDTO.builder().success(false).message("아이템을 찾을 수 없습니다.").build();
		}

		return GameItemsDTO.builder().success(true).message("성공").itemlist(itemList).build();
	}

	@Override
	public GameItemsDTO getItem(long itemIdx) {
		if (itemIdx <= 0) {
			return GameItemsDTO.builder().success(false).message("itemIdx가 유효하지 않습니다.").build();
		}

		GameItemVO item = itemMapper.getItemsDetail(itemIdx);

		if (item == null) {
			return GameItemsDTO.builder().success(false).message("해당 itemIdx에 대한 아이템이 없습니다.").build();
		}

		return GameItemsDTO.builder().success(true).message("아이템 조회 성공").item(item).build();
	}

}
