package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.GameSkinVO;
import com.example.demo.vo.UserSkinVO;

@Mapper
public interface GameSkinMapper {
	// 기본 스킨 조회
	List<GameSkinVO> getAllSkins();
	GameSkinVO getSkin(long skinIdx);
	List<UserSkinVO> getUserSkins(String email);
	UserSkinVO getUserSkin(String email, long skinIdx);

	// 슬라이스 스킨 관련 메서드
	List<GameSkinVO> getAllSliceSkins();
	GameSkinVO getSliceSkin(long skinIdx);
	List<UserSkinVO> getUserSliceSkins(String email);
	UserSkinVO getUserSliceSkin(String email, long skinIdx);
	UserSkinVO getEquippedSliceSkin(String email);

	// 탭 스킨 관련 메서드
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

	// 공통 메서드
	void equipSkin(String email, long skinIdx);
	void unequipSameTypeSkins(String email, long skinIdx);
	void unequipSkin(String email, long skinIdx);

	// 스킨 구매
	void purchaseSkin(String email, long skinIdx, String getType);
	int getSkinPrice(long skinIdx);
	String getSkinPriceType(long skinIdx);
}
