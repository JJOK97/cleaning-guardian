package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PurchaseRequestDTO;
import com.example.demo.dto.PurchaseResponseDTO;
import com.example.demo.service.PurchseService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/v1")
public class PurchaseController {

    @Autowired
    private PurchseService purchseService;

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponseDTO> purchaseItem(@RequestBody PurchaseRequestDTO request) {
        PurchaseResponseDTO response = purchseService.purchaseItem(request);
        return ResponseEntity.ok(response);
    }
}

