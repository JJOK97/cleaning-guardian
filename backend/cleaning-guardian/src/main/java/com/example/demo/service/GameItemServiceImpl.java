package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.GameItemsDTO;
import com.example.demo.dto.UserItemDTO;
import com.example.demo.mapper.BalanceMapper;
import com.example.demo.mapper.GameItemMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.vo.BalanceVO;
import com.example.demo.vo.GameItemVO;
import com.example.demo.vo.UserItemVO;
import com.example.demo.vo.UserVO;

import lombok.extern.slf4j.Slf4j;

/**
 * 게임 아이템 관련 Service 구현체
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 아이템 효과 정보 포함 조회
 * - 장착된 아이템의 효과 계산
 * - 게임 내 아이템 효과 적용
 */
@Slf4j
@Service
public class GameItemServiceImpl implements GameItemService {

	@Autowired
	private GameItemMapper gameItemMapper;
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private BalanceMapper balanceMapper;

	@Override
	public GameItemsDTO getAllItems() {
		List<GameItemVO> items = gameItemMapper.getAllItems();
		
		if (items == null) {
			return GameItemsDTO.builder()
					.success(false)
					.message("아이템 목록을 불러오는데 실패했습니다.")
					.build();
		}
		
		return GameItemsDTO.builder()
				.success(true)
				.message("아이템 목록 조회 성공")
				.items(items)
				.build();
	}

	@Override
	public UserItemDTO getUserItems(String email) {
		// 사용자 정보 조회
		UserVO user = userMapper.findByEmail(email);
		if (user == null) {
			return UserItemDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		
		// 사용자의 아이템 목록 조회
		List<UserItemVO> userItems = gameItemMapper.getUserItems(email);
		
		return UserItemDTO.builder()
				.success(true)
				.message("사용자 아이템 목록 조회 성공")
				.items(userItems)
				.build();
	}

	@Override
	@Transactional
	public UserItemDTO purchaseItem(String email, Long itemIdx) {
		try {
			// 사용자 정보 조회
			UserVO user = userMapper.findByEmail(email);
			if (user == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}
			
			// 아이템 정보 조회
			GameItemVO item = gameItemMapper.getItem(itemIdx);
			if (item == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("아이템을 찾을 수 없습니다.")
						.build();
			}
			
			// 잔액 정보 조회
			BalanceVO balance = balanceMapper.findByEmail(email);
			if (balance == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("잔액 정보를 찾을 수 없습니다.")
						.build();
			}
			
			// 잔액 확인 및 차감
			int result;
			if ("P".equals(item.getPriceType())) {
				// 포인트로 구매
				if (balance.getPoint() < item.getItemPrice()) {
					return UserItemDTO.builder()
							.success(false)
							.message("포인트가 부족합니다.")
							.build();
				}
				result = balanceMapper.decreasePoint(email, item.getItemPrice());
			} else if ("C".equals(item.getPriceType())) {
				// 캐시로 구매
				if (balance.getCash() < item.getItemPrice()) {
					return UserItemDTO.builder()
							.success(false)
							.message("캐시가 부족합니다.")
							.build();
				}
				result = balanceMapper.decreaseCash(email, item.getItemPrice());
			} else {
				return UserItemDTO.builder()
						.success(false)
						.message("잘못된 가격 타입입니다.")
						.build();
			}
			
			if (result == 0) {
				return UserItemDTO.builder()
						.success(false)
						.message("잔액 차감에 실패했습니다.")
						.build();
			}
			
			// 사용자 아이템 정보 조회
			UserItemVO userItem = gameItemMapper.getUserItem(email, itemIdx);
			
			if (userItem == null) {
				// 새로운 아이템 추가
				userItem = UserItemVO.builder()
						.email(email)
						.itemIdx(itemIdx)
						.itemType(item.getPriceType())
						.isUsed('N')
						.count(1)
						.build();
				gameItemMapper.insertUserItem(userItem);
			} else {
				// 기존 아이템 수량 증가
				userItem.setCount(1);
				gameItemMapper.updateUserItemCount(userItem);
			}
			
			// 구매 후 아이템 정보 조회
			UserItemVO purchasedItem = gameItemMapper.getUserItem(email, itemIdx);
			
			return UserItemDTO.builder()
					.success(true)
					.message("아이템 구매 성공")
					.userItemIdx(purchasedItem != null ? purchasedItem.getUserItemIdx() : null)
					.email(purchasedItem != null ? purchasedItem.getEmail() : null)
					.itemIdx(purchasedItem != null ? purchasedItem.getItemIdx() : null)
					.itemType(purchasedItem != null ? purchasedItem.getItemType() : null)
					.isUsed(purchasedItem != null ? purchasedItem.getIsUsed() : 'N')
					.count(purchasedItem != null ? purchasedItem.getCount() : null)
					.createdAt(purchasedItem != null ? purchasedItem.getCreatedAt() : null)
					.item(purchasedItem != null ? purchasedItem.getItem() : null)
					.build();
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	@Transactional
	public UserItemDTO useItem(String email, Long itemIdx) {
		// 사용자 정보 조회
		UserVO user = userMapper.findByEmail(email);
		if (user == null) {
			return UserItemDTO.builder()
					.success(false)
					.message("사용자를 찾을 수 없습니다.")
					.build();
		}
		
		// 사용자 아이템 정보 조회
		UserItemVO userItem = gameItemMapper.getUserItem(email, itemIdx);
		if (userItem == null || userItem.getCount() <= 0) {
			return UserItemDTO.builder()
					.success(false)
					.message("보유한 아이템이 없습니다.")
					.build();
		}
		
		// 아이템 사용 처리
		int result = gameItemMapper.decreaseItemCount(userItem);
		if (result == 0) {
			return UserItemDTO.builder()
					.success(false)
					.message("아이템 사용에 실패했습니다.")
					.build();
		}
		
		return UserItemDTO.builder()
				.success(true)
				.message("아이템 사용 성공")
				.build();
	}

	@Override
	public GameItemsDTO getPointItems() {
		List<GameItemVO> items = gameItemMapper.getPointItems();
		
		if (items == null) {
			return GameItemsDTO.builder()
					.success(false)
					.message("포인트 아이템 목록을 불러오는데 실패했습니다.")
					.build();
		}
		
		return GameItemsDTO.builder()
				.success(true)
				.message("포인트 아이템 목록 조회 성공")
				.items(items)
				.build();
	}

	@Override
	public GameItemsDTO getCashItems() {
		List<GameItemVO> items = gameItemMapper.getCashItems();
		
		if (items == null) {
			return GameItemsDTO.builder()
					.success(false)
					.message("캐시 아이템 목록을 불러오는데 실패했습니다.")
					.build();
		}
		
		return GameItemsDTO.builder()
				.success(true)
				.message("캐시 아이템 목록 조회 성공")
				.items(items)
				.build();
	}

	@Override
	@Transactional
	public UserItemDTO equipItem(String email, Long itemIdx, int slot) {
		try {
			// 사용자 정보 조회
			UserVO user = userMapper.findByEmail(email);
			if (user == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}

			// 아이템 정보 조회
			UserItemVO userItem = gameItemMapper.getUserItem(email, itemIdx);
			if (userItem == null || userItem.getCount() <= 0) {
				return UserItemDTO.builder()
						.success(false)
						.message("보유한 아이템이 없습니다.")
						.build();
			}

			// 해당 슬롯에 이미 장착된 아이템이 있는지 확인
			UserItemVO equippedItem = gameItemMapper.getEquippedItemBySlot(email, slot);
			if (equippedItem != null) {
				// 기존 아이템 해제
				gameItemMapper.unequipItem(email, equippedItem.getItemIdx());
			}

			// 새 아이템 장착
			gameItemMapper.equipItem(email, itemIdx, slot);

			// 장착된 아이템 정보 조회
			UserItemVO updatedItem = gameItemMapper.getUserItem(email, itemIdx);
			
			return UserItemDTO.builder()
					.success(true)
					.message("아이템 장착 성공")
					.userItem(updatedItem)
					.build();
		} catch (Exception e) {
			return UserItemDTO.builder()
					.success(false)
					.message("아이템 장착 실패: " + e.getMessage())
					.build();
		}
	}

	@Override
	@Transactional
	public UserItemDTO unequipItem(String email, Long itemIdx) {
		try {
			// 사용자 정보 조회
			UserVO user = userMapper.findByEmail(email);
			if (user == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}

			// 아이템 정보 조회
			UserItemVO userItem = gameItemMapper.getUserItem(email, itemIdx);
			if (userItem == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("보유한 아이템이 없습니다.")
						.build();
			}

			// 아이템 해제
			gameItemMapper.unequipItem(email, itemIdx);

			return UserItemDTO.builder()
					.success(true)
					.message("아이템 해제 성공")
					.build();
		} catch (Exception e) {
			return UserItemDTO.builder()
					.success(false)
					.message("아이템 해제 실패: " + e.getMessage())
					.build();
		}
	}

	@Override
	public UserItemDTO getEquippedItems(String email) {
		try {
			// 사용자 정보 조회
			UserVO user = userMapper.findByEmail(email);
			if (user == null) {
				return UserItemDTO.builder()
						.success(false)
						.message("사용자를 찾을 수 없습니다.")
						.build();
			}

			// 장착된 아이템 목록 조회
			List<UserItemVO> equippedItems = gameItemMapper.getEquippedItems(email);
			
			return UserItemDTO.builder()
					.success(true)
					.message("장착된 아이템 목록 조회 성공")
					.items(equippedItems)
					.build();
		} catch (Exception e) {
			return UserItemDTO.builder()
					.success(false)
					.message("장착된 아이템 목록 조회 실패: " + e.getMessage())
					.build();
		}
	}

	@Override
	public UserItemDTO giveItem(String email, Long itemIdx) {
		try {
			// 아이템 지급 처리
			int result = gameItemMapper.giveItem(email, itemIdx);
			
			if (result == 0) {
				return UserItemDTO.builder()
					.success(false)
					.message("아이템 지급에 실패했습니다.")
					.build();
			}
			
			return UserItemDTO.builder()
				.success(true)
				.message("아이템이 성공적으로 지급되었습니다.")
				.email(email)
				.itemIdx(itemIdx)
				.build();
				
		} catch (Exception e) {
			return UserItemDTO.builder()
				.success(false)
				.message("아이템 지급 중 오류가 발생했습니다: " + e.getMessage())
				.build();
		}
	}

	// ========== 게임 로직 개선: 아이템 효과 관련 메서드들 ==========

	@Override
	public List<UserItemVO> getEquippedItemsByEffect(String email, String effectType) {
		try {
			return gameItemMapper.getEquippedItemsByEffect(email, effectType);
		} catch (Exception e) {
			log.error("장착된 아이템 효과 조회 실패: {}", e.getMessage());
			return List.of();
		}
	}

	@Override
	public Double getTotalItemEffect(String email, String effectType) {
		try {
			Double totalEffect = gameItemMapper.getTotalItemEffect(email, effectType);
			return totalEffect != null ? totalEffect : 0.0;
		} catch (Exception e) {
			log.error("아이템 효과 합계 조회 실패: {}", e.getMessage());
			return 0.0;
		}
	}

	@Override
	public Map<String, Double> getGameItemEffects(String email) {
		Map<String, Double> effects = new HashMap<>();
		
		try {
			// 모든 효과 타입에 대해 합계 조회
			effects.put("SCORE_BOOST", getTotalItemEffect(email, "SCORE_BOOST"));
			effects.put("TIME_EXTEND", getTotalItemEffect(email, "TIME_EXTEND"));
			effects.put("LIFE_BOOST", getTotalItemEffect(email, "LIFE_BOOST"));
			effects.put("COMBO_BOOST", getTotalItemEffect(email, "COMBO_BOOST"));
			effects.put("SLOW_TIME", getTotalItemEffect(email, "SLOW_TIME"));
			
			return effects;
		} catch (Exception e) {
			log.error("게임 아이템 효과 조회 실패: {}", e.getMessage());
			return effects;
		}
	}

	@Override
	public Long calculateBoostedScore(String email, Long baseScore) {
		try {
			Double scoreBoost = getTotalItemEffect(email, "SCORE_BOOST");
			
			// 점수 부스트는 배수로 적용 (1.0 = 100%, 1.5 = 150%)
			if (scoreBoost > 0) {
				return Math.round(baseScore * (1.0 + scoreBoost));
			}
			
			return baseScore;
		} catch (Exception e) {
			log.error("점수 부스트 계산 실패: {}", e.getMessage());
			return baseScore;
		}
	}

	@Override
	public Integer calculateExtendedTime(String email, Integer baseTime) {
		try {
			Double timeExtend = getTotalItemEffect(email, "TIME_EXTEND");
			
			// 시간 연장은 초 단위로 추가
			if (timeExtend > 0) {
				return baseTime + timeExtend.intValue();
			}
			
			return baseTime;
		} catch (Exception e) {
			log.error("시간 연장 계산 실패: {}", e.getMessage());
			return baseTime;
		}
	}

	@Override
	public Integer calculateBoostedLives(String email, Integer baseLives) {
		try {
			Double lifeBoost = getTotalItemEffect(email, "LIFE_BOOST");
			
			// 생명력 부스트는 개수로 추가
			if (lifeBoost > 0) {
				return baseLives + lifeBoost.intValue();
			}
			
			return baseLives;
		} catch (Exception e) {
			log.error("생명력 부스트 계산 실패: {}", e.getMessage());
			return baseLives;
		}
	}

	@Override
	public Double getComboBoostMultiplier(String email) {
		try {
			Double comboBoost = getTotalItemEffect(email, "COMBO_BOOST");
			
			// 콤보 부스트는 배수로 적용 (기본 1.0에서 추가)
			return 1.0 + (comboBoost != null ? comboBoost : 0.0);
		} catch (Exception e) {
			log.error("콤보 부스트 배수 조회 실패: {}", e.getMessage());
			return 1.0;
		}
	}

	@Override
	public Integer getSlowTimeEffect(String email) {
		try {
			Double slowTime = getTotalItemEffect(email, "SLOW_TIME");
			
			// 슬로우 타임은 지속시간(초)으로 적용
			return slowTime != null ? slowTime.intValue() : 0;
		} catch (Exception e) {
			log.error("슬로우 타임 효과 조회 실패: {}", e.getMessage());
			return 0;
		}
	}
}
