package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.RewardDTO;
import com.example.demo.dto.RewardDetail;
import com.example.demo.enums.RewardType;
import com.example.demo.mapper.RewardMapper;

@Service
public class RewardServiceImpl implements RewardService {

	@Autowired
	private RewardMapper rewardMapper;

	@Autowired
	private GameItemService gameItemService;

	@Override
	@Transactional
	public RewardDTO postReward(String email, List<RewardDetail> rewards) {
		RewardDTO response = RewardDTO.builder()
			.email(email)
			.rewards(rewards)
			.build();

		try {
			for (RewardDetail reward : rewards) {
				switch (reward.getType()) {
					case POINT:
						int pointResult = rewardMapper.postPointReward(reward.getValue(), email);
						if (pointResult == 0) {
							throw new RuntimeException("포인트 보상 지급 실패");
						}
						break;
					case CASH:
						int cashResult = rewardMapper.postCashReward(reward.getValue(), email);
						if (cashResult == 0) {
							throw new RuntimeException("캐시 보상 지급 실패");
						}
						break;
					case ITEM:
						if (reward.getItemIdx() != null) {
							gameItemService.giveItem(email, reward.getItemIdx());
						}
						break;
				}
			}
			
			response.setSuccess(true);
			response.setMessage("보상이 성공적으로 지급되었습니다.");
		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage("보상 지급 중 오류가 발생했습니다: " + e.getMessage());
		}

		return response;
	}
}
