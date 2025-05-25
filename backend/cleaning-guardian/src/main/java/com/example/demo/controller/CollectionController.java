package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CollectionDTO;
import com.example.demo.dto.CollectionDetailDTO;
import com.example.demo.service.CollectionService;

@RestController
@RequestMapping("/api/v1/collections")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    /**
     * 전체 오염물 목록 조회
     */
    @GetMapping
    public ResponseEntity<CollectionDTO> getAllPollutions() {
        CollectionDTO response = collectionService.getAllPollutions();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 사용자별 수집한 오염물 목록 조회
     */
    @GetMapping("/user")
    public ResponseEntity<CollectionDTO> getUserCollections(
            @RequestHeader("email") String email) {
        CollectionDTO response = collectionService.getUserCollections(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 특정 오염물 상세 정보 조회
     */
    @GetMapping("/{polIdx}")
    public ResponseEntity<CollectionDetailDTO> getPollutionDetail(
            @PathVariable Long polIdx) {
        CollectionDetailDTO response = collectionService.getPollutionDetail(polIdx);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 도감 완성도 조회
     */
    @GetMapping("/completion")
    public ResponseEntity<CollectionDTO> getCollectionCompletion(
            @RequestHeader("email") String email) {
        CollectionDTO response = collectionService.getCollectionCompletion(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
} 