package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.CollectionService;

import lombok.RequiredArgsConstructor;

/**
 * 오염물질 수집 관련 API를 처리하는 컨트롤러
 * 
 * 주요 기능:
 * 1. 전체 오염물질 목록 조회
 * 2. 사용자별 수집 목록 조회
 * 3. 오염물질 상세 정보 조회
 * 4. 오염물질 수집 처리
 * 5. 도감 완성도 조회
 * 
 * API 엔드포인트:
 * - GET /api/v1/collections : 전체 오염물질 목록
 * - GET /api/v1/collections/user/{email} : 사용자별 수집 목록
 * - GET /api/v1/collections/{polIdx} : 오염물질 상세 정보
 * - GET /api/v1/collections/completion/{email} : 도감 완성도
 * - POST /api/v1/collections/collect : 오염물질 수집
 */
@RestController
@RequestMapping("/api/v1/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    /**
     * 전체 오염물질 목록을 조회하는 API
     * 
     * @return ResponseEntity<CollectionDTO> - 전체 오염물질 목록과 수집 여부 정보
     * @apiNote 모든 오염물질의 기본 정보와 수집 여부를 포함하여 반환
     */
    @GetMapping
    public ResponseEntity<?> getAllPollutions() {
        return ResponseEntity.ok(collectionService.getAllPollutions());
    }

    /**
     * 특정 사용자의 수집 목록을 조회하는 API
     * 
     * @param email 사용자 이메일
     * @return ResponseEntity<CollectionDTO> - 사용자의 수집 목록과 수집 여부 정보
     * @apiNote 사용자가 수집한 오염물질 목록과 전체 오염물질의 수집 여부를 포함하여 반환
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserCollections(@PathVariable String email) {
        return ResponseEntity.ok(collectionService.getUserCollections(email));
    }

    /**
     * 특정 오염물질의 상세 정보를 조회하는 API
     * 
     * @param polIdx 오염물질 인덱스
     * @return ResponseEntity<CollectionDetailDTO> - 오염물질 상세 정보와 수집 여부
     * @apiNote 오염물질의 모든 상세 정보와 수집 여부를 포함하여 반환
     */
    @GetMapping("/{polIdx}")
    public ResponseEntity<?> getPollution(@PathVariable Long polIdx) {
        return ResponseEntity.ok(collectionService.getPollutionDetail(polIdx));
    }

    /**
     * 사용자의 도감 완성도를 조회하는 API
     * 
     * @param email 사용자 이메일
     * @return ResponseEntity<CollectionDTO> - 도감 완성도
     * @apiNote 사용자가 수집한 오염물질의 비율을 백분율로 반환
     */
    @GetMapping("/completion/{email}")
    public ResponseEntity<?> getCollectionCompletion(@PathVariable String email) {
        return ResponseEntity.ok(collectionService.getCollectionCompletion(email));
    }

    /**
     * 오염물질을 수집하는 API
     * 
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return ResponseEntity<?> - 수집 결과 메시지
     * @apiNote 이미 수집한 오염물질인 경우 실패 메시지 반환
     */
    @PostMapping("/collect")
    public ResponseEntity<?> collectPollution(
        @RequestParam String email,
        @RequestParam Long polIdx
    ) {
        boolean success = collectionService.collectPollution(email, polIdx);
        if (success) {
            return ResponseEntity.ok().body("수집 성공");
        } else {
            return ResponseEntity.badRequest().body("이미 수집한 오염물질입니다.");
        }
    }
} 