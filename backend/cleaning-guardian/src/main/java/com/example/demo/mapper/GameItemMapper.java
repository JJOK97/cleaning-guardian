package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.GameItemVO;
import com.example.demo.vo.UserItemVO;

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
}
