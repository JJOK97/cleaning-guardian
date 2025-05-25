package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

import com.example.demo.dto.GameClearDTO;
import com.example.demo.dto.UserSkinDTO;
import com.example.demo.mapper.GamePlayMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GamePlayServiceImpl implements GamePlayService {

	@Autowired
	GamePlayMapper gamePlayMapper;

	@Autowired
	StagesService stagesService;

	@Autowired
	MapsService mapsService;

	@Override
	public UserSkinDTO patchSkin(long skinIdx, String email) {
		int result = gamePlayMapper.patchSkin(skinIdx, email);

		if (result == 0) {
			return UserSkinDTO.builder().success(false).message("스킨 업데이트 실패").build();
		}
		return UserSkinDTO.builder().success(true).message("스킨 업데이트 성공").email(email).skinIdx(skinIdx).build();
	}

	@Override
	public GameClearDTO stageClear(long stageIdx, String email, String successYn) {
		try {
			log.info("Stage Clear Service - Before DB Update - stageIdx: {}, email: {}, successYn: {}", stageIdx, email, successYn);
			
			// 입력값 검증
			if (email == null || email.trim().isEmpty()) {
				log.error("Invalid email parameter");
				return GameClearDTO.builder()
					.success(false)
					.message("유효하지 않은 이메일입니다.")
					.email(email)
					.stageIdx(stageIdx)
					.successYn(successYn)
					.build();
			}

			if (stageIdx <= 0) {
				log.error("Invalid stageIdx parameter");
				return GameClearDTO.builder()
					.success(false)
					.message("유효하지 않은 스테이지입니다.")
					.email(email)
					.stageIdx(stageIdx)
					.successYn(successYn)
					.build();
			}

			int result = gamePlayMapper.stageClear(stageIdx, email, successYn);
			log.info("Stage Clear Service - After DB Update - result: {}", result);

			if (result == 0) {
				log.error("Stage Clear Failed - DB Update returned 0");
				return GameClearDTO.builder()
					.success(false)
					.message("스테이지 클리어 실패")
					.email(email)
					.stageIdx(stageIdx)
					.successYn("N")
					.build();
			}

			// 스테이지 클리어 성공 시 추가 처리
			if ("Y".equals(successYn)) {
				try {
					// 스테이지 클리어 정보 조회
					Map<String, Object> stageClearInfo = stagesService.checkStageClear(stageIdx, email);
					log.info("Stage Clear Info: {}", stageClearInfo);

					boolean isFinalStage = "Y".equals(stageClearInfo.get("is_final_stage"));
					int clearedStages = ((Number) stageClearInfo.get("cleared_stages_count")).intValue();
					int totalStages = ((Number) stageClearInfo.get("total_stages_count")).intValue();
					long currentMapIdx = ((Number) stageClearInfo.get("map_idx")).longValue();

					log.info("Stage Clear Status - isFinalStage: {}, clearedStages: {}, totalStages: {}, currentMapIdx: {}", 
						isFinalStage, clearedStages, totalStages, currentMapIdx);

					// 모든 스테이지 클리어 시 다음 맵 오픈 처리
					if (isFinalStage && clearedStages == totalStages) {
						log.info("All stages cleared for map: {}", currentMapIdx);
						
						try {
							// 맵 클리어 정보 조회
							Map<String, Object> mapClearInfo = mapsService.checkMapClear(currentMapIdx, email);
							log.info("Map Clear Info: {}", mapClearInfo);

							Long nextMapIdx = (Long) mapClearInfo.get("next_map_idx");
							if (nextMapIdx != null) {
								log.info("Next map will be opened: {}", nextMapIdx);
							}
						} catch (Exception e) {
							log.error("Error checking map clear status: {}", e.getMessage());
							// 맵 클리어 체크 실패는 전체 프로세스를 실패시키지 않음
						}
					}
				} catch (Exception e) {
					log.error("Error in stage clear additional processing: {}", e.getMessage());
					// 추가 처리 실패는 전체 프로세스를 실패시키지 않음
				}
			}
			
			log.info("Stage Clear Success - DB Update successful");
			return GameClearDTO.builder()
				.success(true)
				.message("스테이지 클리어 성공")
				.email(email)
				.stageIdx(stageIdx)
				.successYn(successYn)
				.build();
		} catch (Exception e) {
			log.error("Unexpected error in stageClear: {}", e.getMessage(), e);
			return GameClearDTO.builder()
				.success(false)
				.message("서버 오류가 발생했습니다.")
				.email(email)
				.stageIdx(stageIdx)
				.successYn(successYn)
				.build();
		}
	}

}
