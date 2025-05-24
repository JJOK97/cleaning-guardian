package com.example.demo.controller;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.dto.UserItemDTO;
import com.example.demo.service.GameItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 게임 아이템 관련 API 컨트롤러
 * 아이템 조회, 구매, 사용 등의 기능을 제공합니다.
 */
@RestController
@RequestMapping("/api/v1/items")
public class GameItemController {

	@Autowired
	private GameItemService gameItemService;

	/**
	 * 모든 게임 아이템 목록을 조회합니다.
	 * @return 전체 아이템 목록과 응답 상태
	 */
	@GetMapping
	public ResponseEntity<GameItemsDTO> getAllItems() {
		GameItemsDTO response = gameItemService.getAllItems();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 현재 로그인한 사용자가 보유한 아이템 목록을 조회합니다.
	 * @param email 사용자 이메일
	 * @return 사용자 보유 아이템 목록과 응답 상태
	 */
	@GetMapping("/user")
	public ResponseEntity<UserItemDTO> getUserItems(@RequestHeader("email") String email) {
		UserItemDTO response = gameItemService.getUserItems(email);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 특정 아이템을 구매합니다.
	 * @param email 사용자 이메일
	 * @param itemIdx 구매할 아이템의 인덱스
	 * @return 구매 결과와 응답 상태
	 */
	@PostMapping("/purchase/{itemIdx}")
	public ResponseEntity<UserItemDTO> purchaseItem(
			@RequestHeader("email") String email,
			@PathVariable Long itemIdx) {
		UserItemDTO response = gameItemService.purchaseItem(email, itemIdx);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 보유한 아이템을 사용합니다.
	 * @param email 사용자 이메일
	 * @param itemIdx 사용할 아이템의 인덱스
	 * @return 아이템 사용 결과와 응답 상태
	 */
	@PostMapping("/use/{itemIdx}")
	public ResponseEntity<UserItemDTO> useItem(
			@RequestHeader("email") String email,
			@PathVariable Long itemIdx) {
		UserItemDTO response = gameItemService.useItem(email, itemIdx);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 포인트로 구매 가능한 아이템 목록을 조회합니다.
	 * @return 포인트 아이템 목록과 응답 상태
	 */
	@GetMapping("/point")
	public ResponseEntity<GameItemsDTO> getPointItems() {
		GameItemsDTO response = gameItemService.getPointItems();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 캐시로 구매 가능한 아이템 목록을 조회합니다.
	 * @return 캐시 아이템 목록과 응답 상태
	 */
	@GetMapping("/cash")
	public ResponseEntity<GameItemsDTO> getCashItems() {
		GameItemsDTO response = gameItemService.getCashItems();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}