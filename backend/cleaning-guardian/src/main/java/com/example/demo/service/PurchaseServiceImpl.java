package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PurchaseRequestDTO;
import com.example.demo.dto.PurchaseResponseDTO;
import com.example.demo.mapper.PurchaseMapper;
import com.example.demo.mapper.PurchaseeMapper;
import com.example.demo.vo.GameItemVO;
import com.example.demo.vo.UserItemVO;

@Service
public class PurchaseServiceImpl implements PurchaseMapper {
	

	    @Autowired
	    private PurchaseeMapper purchaseMapper;

	    @Override
	    public PurchaseResponseDTO purchaseItem(PurchaseRequestDTO request) {
	        GameItemVO item = purchaseMapper.selectItemById(request.getItemIdx());
	        if (item == null) {
	            return new PurchaseResponseDTO(false, "아이템이 존재하지 않습니다.");
	        }

	        Long userBalance = purchaseMapper.selectUserBalance(request.getEmail());
	        if (userBalance < item.getItemPrice()) {
	            return new PurchaseResponseDTO(false, "잔액이 부족합니다.");
	        }

	        // 유저 아이템 보유 여부 체크
	        UserItemVO existing = purchaseMapper.selectUserItem(request.getEmail(), item.getItemIdx());
	        if (existing == null) {
	            UserItemVO newItem = new UserItemVO();
	            newItem.setEmail(request.getEmail());
	            newItem.setSkinIdx(item.getItemIdx());
	            newItem.setGetType("P");
	            purchaseMapper.insertUserItem(newItem);
	        } else {
	            existing.setGetType("P");
	            purchaseMapper.updateUserItem(existing);
	        }

	        // 결제 처리
	        purchaseMapper.updateUserBalance(request.getEmail(), item.getItemPrice());
	        purchaseMapper.insertReceipt(request.getEmail(), item.getItemPrice(), item.getPriceType(), "O");

	        return new PurchaseResponseDTO(true, "구매가 완료되었습니다.");
	    }
	}


}
