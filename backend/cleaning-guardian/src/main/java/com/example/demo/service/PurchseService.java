package com.example.demo.service;

import com.example.demo.dto.PurchaseRequestDTO;
import com.example.demo.dto.PurchaseResponseDTO;

public interface PurchseService {
	PurchaseResponseDTO purchaseItem(PurchaseRequestDTO request);

}
