package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.mapper.BalanceMapper;
import com.example.demo.mapper.GameSkinMapper;
import com.example.demo.vo.GameSkinVO;
import com.example.demo.vo.UserSkinVO;

@Service
public class GameSkinServiceImpl implements GameSkinService {
	private static final Logger log = LoggerFactory.getLogger(GameSkinServiceImpl.class);

	@Autowired
	private GameSkinMapper skinMapper;

	@Autowired
	private BalanceMapper balanceMapper;

	// 기본 스킨 조회
	@Override
	public GameSkinVO getSkin(long skinIdx) {
		return skinMapper.getSkin(skinIdx);
	}

	@Override
	public List<UserSkinVO> getUserSkins(String email) {
		return skinMapper.getUserSkins(email);
	}

	@Override
	public UserSkinVO getUserSkin(String email, long skinIdx) {
		return skinMapper.getUserSkin(email, skinIdx);
	}

	// 슬라이스 스킨 조회
	@Override
	public List<GameSkinVO> getAllSliceSkins() {
		return skinMapper.getAllSliceSkins();
	}

	@Override
	public GameSkinVO getSliceSkin(long skinIdx) {
		return skinMapper.getSliceSkin(skinIdx);
	}

	@Override
	public List<UserSkinVO> getUserSliceSkins(String email) {
		List<UserSkinVO> userSkins = skinMapper.getUserSliceSkins(email);
		for (UserSkinVO userSkin : userSkins) {
			if (userSkin != null && userSkin.getSkin() == null) {
				GameSkinVO skinInfo = skinMapper.getSkin(userSkin.getSkinIdx());
				userSkin.setSkin(skinInfo);
			}
		}
		return userSkins;
	}

	@Override
	public UserSkinVO getUserSliceSkin(String email, long skinIdx) {
		return skinMapper.getUserSliceSkin(email, skinIdx);
	}

	@Override
	public UserSkinVO getEquippedSliceSkin(String email) {
		UserSkinVO userSkin = skinMapper.getEquippedSliceSkin(email);
		if (userSkin != null && userSkin.getSkin() == null) {
			GameSkinVO skinInfo = skinMapper.getSkin(userSkin.getSkinIdx());
			userSkin.setSkin(skinInfo);
		}
		return userSkin;
	}

	// 탭 스킨 조회
	@Override
	public List<GameSkinVO> getAllTapSkins() {
		return skinMapper.getAllTapSkins();
	}

	@Override
	public GameSkinVO getTapSkin(long skinIdx) {
		return skinMapper.getTapSkin(skinIdx);
	}

	@Override
	public List<UserSkinVO> getUserTapSkins(String email) {
		List<UserSkinVO> userSkins = skinMapper.getUserTapSkins(email);
		for (UserSkinVO userSkin : userSkins) {
			if (userSkin != null && userSkin.getSkin() == null) {
				GameSkinVO skinInfo = skinMapper.getSkin(userSkin.getSkinIdx());
				userSkin.setSkin(skinInfo);
			}
		}
		return userSkins;
	}

	@Override
	public UserSkinVO getUserTapSkin(String email, long skinIdx) {
		return skinMapper.getUserTapSkin(email, skinIdx);
	}

	@Override
	public UserSkinVO getEquippedTapSkin(String email) {
		UserSkinVO userSkin = skinMapper.getEquippedTapSkin(email);
		if (userSkin != null && userSkin.getSkin() == null) {
			GameSkinVO skinInfo = skinMapper.getSkin(userSkin.getSkinIdx());
			userSkin.setSkin(skinInfo);
		}
		return userSkin;
	}

	// 캐시/포인트 스킨 조회
	@Override
	public List<GameSkinVO> getCashSkins() {
		return skinMapper.getCashSkins();
	}

	@Override
	public List<GameSkinVO> getPointSkins() {
		return skinMapper.getPointSkins();
	}

	@Override
	public List<GameSkinVO> getCashSliceSkins() {
		return skinMapper.getCashSliceSkins();
	}

	@Override
	public List<GameSkinVO> getCashTapSkins() {
		return skinMapper.getCashTapSkins();
	}

	@Override
	public List<GameSkinVO> getPointSliceSkins() {
		return skinMapper.getPointSliceSkins();
	}

	@Override
	public List<GameSkinVO> getPointTapSkins() {
		return skinMapper.getPointTapSkins();
	}

	// 스킨 장착/해제
	@Override
	public String equipSkin(String email, long skinIdx) {
		GameSkinVO skin = skinMapper.getSkin(skinIdx);
		if (skin == null) {
			log.error("존재하지 않는 스킨 장착 시도 - skinIdx: {}", skinIdx);
			return "존재하지 않는 스킨입니다.";
		}

		UserSkinVO userSkin = skinMapper.getUserSkin(email, skinIdx);
		if (userSkin == null) {
			log.error("미보유 스킨 장착 시도 - email: {}, skinIdx: {}", email, skinIdx);
			return "보유하지 않은 스킨입니다.";
		}

		skinMapper.unequipSameTypeSkins(email, skinIdx);
		skinMapper.equipSkin(email, skinIdx);
		log.info("스킨 장착 완료 - email: {}, skinIdx: {}", email, skinIdx);
		return "스킨 장착이 완료되었습니다.";
	}

	@Override
	public String unequipSkin(String email, long skinIdx) {
		UserSkinVO userSkin = skinMapper.getUserSkin(email, skinIdx);
		if (userSkin == null) {
			log.error("미보유 스킨 해제 시도 - email: {}, skinIdx: {}", email, skinIdx);
			return "보유하지 않은 스킨입니다.";
		}

		skinMapper.unequipSkin(email, skinIdx);
		log.info("스킨 해제 완료 - email: {}, skinIdx: {}", email, skinIdx);
		return "스킨 해제가 완료되었습니다.";
	}

	// 스킨 구매
	@Override
	public String purchaseSkin(String email, long skinIdx) {
		// 스킨 존재 여부 확인
		GameSkinVO skin = skinMapper.getSkin(skinIdx);
		if (skin == null) {
			log.error("존재하지 않는 스킨 구매 시도 - skinIdx: {}", skinIdx);
			return "존재하지 않는 스킨입니다.";
		}

		// 이미 보유한 스킨인지 확인
		UserSkinVO userSkin = skinMapper.getUserSkin(email, skinIdx);
		if (userSkin != null) {
			log.error("이미 보유한 스킨 구매 시도 - email: {}, skinIdx: {}", email, skinIdx);
			return "이미 보유한 스킨입니다.";
		}

		// 가격과 가격 타입 조회
		int price = skinMapper.getSkinPrice(skinIdx);
		String priceType = skinMapper.getSkinPriceType(skinIdx);

		// 잔액 확인 및 차감
		if ("C".equals(priceType)) {
			// 캐시 차감
			int result = balanceMapper.decreaseCash(email, price);
			if (result == 0) {
				log.error("캐시 부족으로 구매 실패 - email: {}, skinIdx: {}, price: {}", email, skinIdx, price);
				return "캐시가 부족합니다.";
			}
		} else {
			// 포인트 차감
			int result = balanceMapper.decreasePoint(email, price);
			if (result == 0) {
				log.error("포인트 부족으로 구매 실패 - email: {}, skinIdx: {}, price: {}", email, skinIdx, price);
				return "포인트가 부족합니다.";
			}
		}

		// 스킨 구매
		skinMapper.purchaseSkin(email, skinIdx, priceType);
		log.info("스킨 구매 완료 - email: {}, skinIdx: {}, priceType: {}, price: {}", email, skinIdx, priceType, price);
		return "스킨 구매가 완료되었습니다.";
	}
}