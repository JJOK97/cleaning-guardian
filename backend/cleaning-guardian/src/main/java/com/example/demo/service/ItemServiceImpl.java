package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ItemsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.mapper.ItemMapper;
import com.example.demo.vo.ItemsVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    
    private final ItemMapper itemMapper;

    @Override
    public ItemsDTO getAlluserItems() {
        List<ItemsVO> itemList = itemMapper.getAlluserItems();

        if (itemList == null) {
            return ItemsDTO.builder().success(false).message("아이템을 찾을 수 없습니다.").build();
        }

        return ItemsDTO.builder().success(true).message("성공").itemlist(itemList).build();
    }
    
    @Override
    public ItemsDTO getUserItemsDetail(long itemIdx) {
        if (itemIdx <= 0) {
            return ItemsDTO.builder().success(false).message("itemIdx가 유효하지 않습니다.").build();
        }

        ItemsVO item = itemMapper.getItemDetailByIdx(itemIdx);

        if (item == null) {
            return ItemsDTO.builder().success(false).message("해당 itemIdx에 대한 아이템이 없습니다.").build();
        }

        return ItemsDTO.builder().success(true).message("아이템 조회 성공").item(item).build();
    }


}

	
	
	
	


