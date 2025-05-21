package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ItemsDTO;
import com.example.demo.dto.MapsDTO;
import com.example.demo.mapper.ItemMapper;
import com.example.demo.vo.ItemsVO;

@Service
public class ItemServiceimpl implements ItemService {

    @Autowired
    private ItemMapper itemMapper;

    @Override
    public ItemsDTO getAllItems() {
        List<ItemsVO> itemList = itemMapper.getAllItems();

        if (itemList == null) {
            return ItemsDTO.builder().success(false).message("아이템을 찾을 수 없습니다.").build();
        }

        return ItemsDTO.builder().success(true).message("성공").itemlist(itemList).build();
    }

    @Override
    public ItemsDTO getUsersItems(String email) {
        if (email == null) {
            return ItemsDTO.builder().success(false).message("이메일이 없습니다.").build();
        }

        List<ItemsVO> itemList = itemMapper.getUsersItems(email);

        if (itemList == null) {
            return ItemsDTO.builder().success(false).message("해당 사용자의 아이템이 없습니다.").email(email).build();
        }

        return ItemsDTO.builder().success(true).message("성공").itemlist(itemList).email(email).build();
    }
}

	
	
	
	


