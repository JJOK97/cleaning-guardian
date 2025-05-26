package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.dto.UserItemDTO;
import com.example.demo.service.GameItemService;
import com.example.demo.vo.UserItemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 게임 아이템 관련 API 컨트롤러
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 아이템 효과 정보 포함 조회
 * - 장착된 아이템의 효과 계산
 * - 게임 내 아이템 효과 적용
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
	
	/**
	 * 아이템 장착
	 * @param email 사용자 이메일
	 * @param itemIdx 장착할 아이템의 인덱스
	 * @param slot 장착할 슬롯 번호 (1, 2, 3)
	 * @return 장착 결과
	 */
	@PostMapping("/equip/{itemIdx}")
	public ResponseEntity<UserItemDTO> equipItem(
			@RequestHeader("email") String email,
			@PathVariable Long itemIdx,
			@RequestParam int slot) {
		UserItemDTO response = gameItemService.equipItem(email, itemIdx, slot);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 아이템 해제
	 * @param email 사용자 이메일
	 * @param itemIdx 해제할 아이템의 인덱스
	 * @return 해제 결과
	 */
	@PostMapping("/unequip/{itemIdx}")
	public ResponseEntity<UserItemDTO> unequipItem(
			@RequestHeader("email") String email,
			@PathVariable Long itemIdx) {
		UserItemDTO response = gameItemService.unequipItem(email, itemIdx);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * 장착된 아이템 목록 조회
	 * @param email 사용자 이메일
	 * @return 장착된 아이템 목록
	 */
	@GetMapping("/equipped")
	public ResponseEntity<UserItemDTO> getEquippedItems(
			@RequestHeader("email") String email) {
		UserItemDTO response = gameItemService.getEquippedItems(email);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// ========== 게임 로직 개선: 아이템 효과 관련 API 엔드포인트들 ==========

	/**
	 * 특정 효과 타입의 장착된 아이템 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입 (SCORE_BOOST, TIME_EXTEND, LIFE_BOOST, COMBO_BOOST, SLOW_TIME)
	 * @return 해당 효과를 가진 장착된 아이템 목록
	 */
	@GetMapping("/equipped/effects/{effectType}")
	public ResponseEntity<List<UserItemVO>> getEquippedItemsByEffect(
			@RequestHeader("email") String email,
			@PathVariable String effectType) {
		try {
			List<UserItemVO> items = gameItemService.getEquippedItemsByEffect(email, effectType);
			return new ResponseEntity<>(items, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 사용자의 특정 아이템 효과 합계 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입
	 * @return 효과 수치 합계
	 */
	@GetMapping("/effects/{effectType}/total")
	public ResponseEntity<Map<String, Object>> getTotalItemEffect(
			@RequestHeader("email") String email,
			@PathVariable String effectType) {
		try {
			Double totalEffect = gameItemService.getTotalItemEffect(email, effectType);
			
			Map<String, Object> response = Map.of(
				"email", email,
				"effectType", effectType,
				"totalEffect", totalEffect
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "아이템 효과 조회 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 게임 시작 시 적용할 모든 아이템 효과 정보 조회
	 * @param email 사용자 이메일
	 * @return 아이템 효과 정보 맵 (effectType -> totalValue)
	 */
	@GetMapping("/effects/game-start")
	public ResponseEntity<Map<String, Double>> getGameItemEffects(
			@RequestHeader("email") String email) {
		try {
			Map<String, Double> effects = gameItemService.getGameItemEffects(email);
			return new ResponseEntity<>(effects, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 아이템 효과가 적용된 점수 계산
	 * @param email 사용자 이메일
	 * @param baseScore 기본 점수
	 * @return 아이템 효과가 적용된 최종 점수
	 */
	@GetMapping("/effects/score-boost")
	public ResponseEntity<Map<String, Object>> calculateBoostedScore(
			@RequestHeader("email") String email,
			@RequestParam Long baseScore) {
		try {
			Long boostedScore = gameItemService.calculateBoostedScore(email, baseScore);
			
			Map<String, Object> response = Map.of(
				"baseScore", baseScore,
				"boostedScore", boostedScore,
				"boostMultiplier", boostedScore.doubleValue() / baseScore.doubleValue()
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "점수 부스트 계산 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 아이템 효과가 적용된 제한시간 계산
	 * @param email 사용자 이메일
	 * @param baseTime 기본 제한시간 (초)
	 * @return 아이템 효과가 적용된 최종 제한시간
	 */
	@GetMapping("/effects/time-extend")
	public ResponseEntity<Map<String, Object>> calculateExtendedTime(
			@RequestHeader("email") String email,
			@RequestParam Integer baseTime) {
		try {
			Integer extendedTime = gameItemService.calculateExtendedTime(email, baseTime);
			
			Map<String, Object> response = Map.of(
				"baseTime", baseTime,
				"extendedTime", extendedTime,
				"timeBonus", extendedTime - baseTime
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "시간 연장 계산 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 아이템 효과가 적용된 생명력 계산
	 * @param email 사용자 이메일
	 * @param baseLives 기본 생명력
	 * @return 아이템 효과가 적용된 최종 생명력
	 */
	@GetMapping("/effects/life-boost")
	public ResponseEntity<Map<String, Object>> calculateBoostedLives(
			@RequestHeader("email") String email,
			@RequestParam Integer baseLives) {
		try {
			Integer boostedLives = gameItemService.calculateBoostedLives(email, baseLives);
			
			Map<String, Object> response = Map.of(
				"baseLives", baseLives,
				"boostedLives", boostedLives,
				"lifeBonus", boostedLives - baseLives
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "생명력 부스트 계산 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 콤보 보너스 아이템 효과 확인
	 * @param email 사용자 이메일
	 * @return 콤보 보너스 배수 (기본 1.0)
	 */
	@GetMapping("/effects/combo-boost")
	public ResponseEntity<Map<String, Object>> getComboBoostMultiplier(
			@RequestHeader("email") String email) {
		try {
			Double comboMultiplier = gameItemService.getComboBoostMultiplier(email);
			
			Map<String, Object> response = Map.of(
				"comboMultiplier", comboMultiplier,
				"bonusPercentage", (comboMultiplier - 1.0) * 100
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "콤보 부스트 조회 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 슬로우 타임 아이템 효과 확인
	 * @param email 사용자 이메일
	 * @return 슬로우 타임 지속시간 (초, 0이면 효과 없음)
	 */
	@GetMapping("/effects/slow-time")
	public ResponseEntity<Map<String, Object>> getSlowTimeEffect(
			@RequestHeader("email") String email) {
		try {
			Integer slowTimeDuration = gameItemService.getSlowTimeEffect(email);
			
			Map<String, Object> response = Map.of(
				"slowTimeDuration", slowTimeDuration,
				"hasSlowTimeEffect", slowTimeDuration > 0
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "슬로우 타임 효과 조회 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}