package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.GameItemVO;
import com.example.demo.vo.UserItemVO;

/**
 * 게임 아이템 관련 Mapper
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 아이템 효과 정보 포함 조회 (effectType, effectValue, effectDuration)
 * - 장착된 아이템의 효과 정보 제공
 */
@Mapper
public interface GameItemMapper {
	
	/**
	 * 모든 게임 아이템 목록을 조회합니다.
	 * @return 게임 아이템 목록
	 */
	List<GameItemVO> getAllItems();
	
	/**
	 * 특정 아이템의 상세 정보를 조회합니다.
	 * @param itemIdx 아이템 인덱스
	 * @return 아이템 정보
	 */
	GameItemVO getItem(Long itemIdx);
	
	/**
	 * 사용자가 보유한 아이템 목록을 조회합니다.
	 * @param email 사용자 이메일
	 * @return 사용자 아이템 목록
	 */
	List<UserItemVO> getUserItems(String email);
	
	/**
	 * 사용자가 보유한 특정 아이템 정보를 조회합니다.
	 * @param email 사용자 이메일
	 * @param itemIdx 아이템 인덱스
	 * @return 사용자 아이템 정보
	 */
	UserItemVO getUserItem(String email, Long itemIdx);
	
	/**
	 * 새로운 사용자 아이템을 추가합니다.
	 * @param userItem 사용자 아이템 정보
	 * @return 추가된 행 수
	 */
	int insertUserItem(UserItemVO userItem);
	
	/**
	 * 사용자 아이템의 수량을 업데이트합니다.
	 * @param userItem 사용자 아이템 정보
	 * @return 업데이트된 행 수
	 */
	int updateUserItemCount(UserItemVO userItem);
	
	/**
	 * 사용자 아이템의 수량을 감소시킵니다.
	 * @param userItem 사용자 아이템 정보
	 * @return 업데이트된 행 수
	 */
	int decreaseItemCount(UserItemVO userItem);

	/**
	 * 포인트로 구매 가능한 아이템 목록을 조회합니다.
	 * @return 포인트 아이템 목록
	 */
	List<GameItemVO> getPointItems();

	/**
	 * 캐시로 구매 가능한 아이템 목록을 조회합니다.
	 * @return 캐시 아이템 목록
	 */
	List<GameItemVO> getCashItems();

	/**
	 * 특정 슬롯에 장착된 아이템을 조회합니다.
	 * @param email 사용자 이메일
	 * @param slot 장착 슬롯 번호
	 * @return 장착된 아이템 정보
	 */
	UserItemVO getEquippedItemBySlot(String email, int slot);

	/**
	 * 아이템을 장착합니다.
	 * @param email 사용자 이메일
	 * @param itemIdx 아이템 인덱스
	 * @param slot 장착할 슬롯 번호
	 */
	void equipItem(String email, Long itemIdx, int slot);

	/**
	 * 아이템을 해제합니다.
	 * @param email 사용자 이메일
	 * @param itemIdx 아이템 인덱스
	 */
	void unequipItem(String email, Long itemIdx);

	/**
	 * 사용자가 장착한 모든 아이템 목록을 조회합니다.
	 * @param email 사용자 이메일
	 * @return 장착된 아이템 목록
	 */
	List<UserItemVO> getEquippedItems(String email);

	/**
	 * 아이템 지급
	 * @param email 사용자 이메일
	 * @param itemIdx 지급할 아이템 ID
	 * @return 처리 결과
	 */
	int giveItem(String email, Long itemIdx);

	/**
	 * 특정 효과 타입의 장착된 아이템 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입 (SCORE_BOOST, TIME_EXTEND 등)
	 * @return 해당 효과를 가진 장착된 아이템 목록
	 */
	List<UserItemVO> getEquippedItemsByEffect(@Param("email") String email, @Param("effectType") String effectType);

	/**
	 * 사용자의 모든 아이템 효과 합계 조회
	 * @param email 사용자 이메일
	 * @param effectType 효과 타입
	 * @return 효과 수치 합계
	 */
	Double getTotalItemEffect(@Param("email") String email, @Param("effectType") String effectType);
}
