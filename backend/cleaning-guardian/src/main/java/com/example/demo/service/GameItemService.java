package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.dto.UserItemDTO;
import com.example.demo.vo.UserItemVO;

/**
 * 게임 아이템 관련 Service
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 아이템 효과 정보 포함 조회
 * - 장착된 아이템의 효과 계산
 * - 게임 내 아이템 효과 적용
 */
public interface GameItemService {
	
	// 모든 아이템 목록 조회
	GameItemsDTO getAllItems();
	
	// 사용자가 보유한 아이템 목록 조회
	UserItemDTO getUserItems(String email);
	
	// 아이템 구매
	UserItemDTO purchaseItem(String email, Long itemIdx);
	
	// 아이템 사용
	UserItemDTO useItem(String email, Long itemIdx);

	// 포인트 아이템 목록 조회
	GameItemsDTO getPointItems();

	// 캐시 아이템 목록 조회
	GameItemsDTO getCashItems();

	// 아이템 장착
	UserItemDTO equipItem(String email, Long itemIdx, int slot);
	
	// 아이템 해제
	UserItemDTO unequipItem(String email, Long itemIdx);
	
	// 장착된 아이템 목록 조회
	UserItemDTO getEquippedItems(String email);

	/**
	 * 아이템 지급
	 * @param email 사용자 이메일
	 * @param itemIdx 지급할 아이템 ID
	 * @return 지급 결과
	 */
	UserItemDTO giveItem(String email, Long itemIdx);

	/**
	 * 특정 효과 타입의 장착된 아이템 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입 (SCORE_BOOST, TIME_EXTEND, LIFE_BOOST, COMBO_BOOST, SLOW_TIME)
	 * @return 해당 효과를 가진 장착된 아이템 목록
	 */
	List<UserItemVO> getEquippedItemsByEffect(String email, String effectType);

	/**
	 * 사용자의 모든 아이템 효과 합계 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입
	 * @return 효과 수치 합계
	 */
	Double getTotalItemEffect(String email, String effectType);

	/**
	 * 게임 시작 시 적용할 아이템 효과 정보 조회
	 * @param email 사용자 이메일
	 * @return 아이템 효과 정보 맵 (effectType -> totalValue)
	 */
	Map<String, Double> getGameItemEffects(String email);

	/**
	 * 아이템 효과가 적용된 점수 계산
	 * @param email 사용자 이메일
	 * @param baseScore 기본 점수
	 * @return 아이템 효과가 적용된 최종 점수
	 */
	Long calculateBoostedScore(String email, Long baseScore);

	/**
	 * 아이템 효과가 적용된 제한시간 계산
	 * @param email 사용자 이메일
	 * @param baseTime 기본 제한시간 (초)
	 * @return 아이템 효과가 적용된 최종 제한시간
	 */
	Integer calculateExtendedTime(String email, Integer baseTime);

	/**
	 * 아이템 효과가 적용된 생명력 계산
	 * @param email 사용자 이메일
	 * @param baseLives 기본 생명력
	 * @return 아이템 효과가 적용된 최종 생명력
	 */
	Integer calculateBoostedLives(String email, Integer baseLives);

	/**
	 * 콤보 보너스 아이템 효과 확인
	 * @param email 사용자 이메일
	 * @return 콤보 보너스 배수 (기본 1.0)
	 */
	Double getComboBoostMultiplier(String email);

	/**
	 * 슬로우 타임 아이템 효과 확인
	 * @param email 사용자 이메일
	 * @return 슬로우 타임 지속시간 (초, 0이면 효과 없음)
	 */
	Integer getSlowTimeEffect(String email);

}
