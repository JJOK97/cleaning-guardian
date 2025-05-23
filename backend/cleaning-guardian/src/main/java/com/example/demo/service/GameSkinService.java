package com.example.demo.service;

import java.util.List;
import com.example.demo.vo.GameSkinVO;
import com.example.demo.vo.UserSkinVO;

public interface GameSkinService {

	// 기본 스킨 조회
	GameSkinVO getSkin(long skinIdx);

	List<UserSkinVO> getUserSkins(String email);

	UserSkinVO getUserSkin(String email, long skinIdx);

	// 슬라이스 스킨 조회
	List<GameSkinVO> getAllSliceSkins();

	GameSkinVO getSliceSkin(long skinIdx);

	List<UserSkinVO> getUserSliceSkins(String email);

	UserSkinVO getUserSliceSkin(String email, long skinIdx);

	UserSkinVO getEquippedSliceSkin(String email);

	// 탭 스킨 조회
	List<GameSkinVO> getAllTapSkins();

	GameSkinVO getTapSkin(long skinIdx);

	List<UserSkinVO> getUserTapSkins(String email);

	UserSkinVO getUserTapSkin(String email, long skinIdx);

	UserSkinVO getEquippedTapSkin(String email);

	// 캐시/포인트 스킨 조회
	List<GameSkinVO> getCashSkins();

	List<GameSkinVO> getPointSkins();

	List<GameSkinVO> getCashSliceSkins();

	List<GameSkinVO> getCashTapSkins();

	List<GameSkinVO> getPointSliceSkins();

	List<GameSkinVO> getPointTapSkins();

	// 스킨 장착/해제
	String equipSkin(String email, long skinIdx);

	String unequipSkin(String email, long skinIdx);

	// 스킨 구매
	String purchaseSkin(String email, long skinIdx);
}
