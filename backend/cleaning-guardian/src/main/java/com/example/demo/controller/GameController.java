package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PollutionsDTO;
import com.example.demo.dto.UserPlayDTO;
import com.example.demo.service.GameServiceImpl;
import com.example.demo.service.GameStageConfigService;
import com.example.demo.vo.GameStageConfigVO;
import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 게임 관련 Controller
 * 
 * 게임 로직 개선을 위해 확장된 기능:
 * - 오염물질 게임 속성 포함 조회
 * - 수집 데이터 저장 및 통계 관리
 * - 스테이지별 게임 설정 적용
 * - 게임 결과 처리 및 아이템 효과 적용
 */
@RestController
@RequestMapping("/api/v1")
public class GameController {

	@Autowired
	private GameServiceImpl gameService;
	
	@Autowired
	private GameStageConfigService gameStageConfigService;

	// 게임 입장
	@PostMapping("/user-plays")
	public ResponseEntity<UserPlayDTO> gameStart(@RequestParam String email, @RequestParam long stageIdx) {
		UserPlayDTO gamestart = gameService.gameStart(email, stageIdx);
		return new ResponseEntity<>(gamestart, HttpStatus.OK);
	}

	// 게임 입장시 스테이지 오염물 가져오기
	@GetMapping("/user-plays/{stageIdx}/pollutions")
	public ResponseEntity<PollutionsDTO> getStagePollutions(@PathVariable("stageIdx") long stageIdx) {
		PollutionsDTO pollutions = gameService.getStagePollutions(stageIdx);
		return new ResponseEntity<>(pollutions, HttpStatus.OK);
	}

	// 전체 스테이지 오염물 조회	
	@GetMapping("/pollutions")
	public ResponseEntity<PollutionsDTO> getAllPollutions() {
		PollutionsDTO pollutions = gameService.getAllPollutions();
		return new ResponseEntity<>(pollutions, HttpStatus.OK);
	}

	// ========== 게임 로직 개선: 새로운 API 엔드포인트들 ==========

	/**
	 * 스테이지별 게임 설정 조회
	 * @param stageIdx 스테이지 인덱스
	 * @return 스테이지 게임 설정 (제한시간, 생명력, 오염물질 생성 주기 등)
	 */
	@GetMapping("/stages/{stageIdx}/config")
	public ResponseEntity<GameStageConfigVO> getStageConfig(@PathVariable("stageIdx") Long stageIdx) {
		try {
			// GameStageConfigService를 직접 호출하여 올바른 기본 설정 생성
			GameStageConfigVO config = gameStageConfigService.getStageConfig(stageIdx);
			
			// 디버깅용 로그 추가
			System.out.println("=== Controller 디버깅 (수정 후) ===");
			System.out.println("stageIdx: " + stageIdx);
			System.out.println("config: " + config);
			System.out.println("config.getTargetScore(): " + (config != null ? config.getTargetScore() : "null"));
			System.out.println("================================");
			
			return new ResponseEntity<>(config, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 게임 결과 저장 - 처치한 오염물질 데이터 기록
	 * @param email 사용자 이메일
	 * @param gameResult 게임 결과 데이터 (처치한 오염물질 목록 포함)
	 * @return 저장 결과
	 */
	@PostMapping("/game-results")
	public ResponseEntity<Map<String, Object>> saveGameResult(
			@RequestParam String email, 
			@RequestBody Map<String, Object> gameResult) {
		try {
			boolean success = gameService.processGameCompletion(email, gameResult);
			
			Map<String, Object> response = Map.of(
				"success", success,
				"message", success ? "게임 결과가 성공적으로 저장되었습니다." : "게임 결과 저장에 실패했습니다."
			);
			
			return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"success", false,
				"message", "게임 결과 저장 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 사용자 수집 통계 조회
	 * @param email 사용자 이메일
	 * @return 사용자의 전체 수집 통계
	 */
	@GetMapping("/users/{email}/collection-stats")
	public ResponseEntity<List<UserCollectionStatsVO>> getUserCollectionStats(@PathVariable("email") String email) {
		try {
			List<UserCollectionStatsVO> stats = gameService.getUserCollectionStats(email);
			return new ResponseEntity<>(stats, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 특정 오염물질 수집 통계 조회
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @return 해당 오염물질의 수집 통계
	 */
	@GetMapping("/users/{email}/pollutions/{polIdx}/stats")
	public ResponseEntity<UserCollectionStatsVO> getPollutionStats(
			@PathVariable("email") String email, 
			@PathVariable("polIdx") Long polIdx) {
		try {
			UserCollectionStatsVO stats = gameService.getPollutionStats(email, polIdx);
			return new ResponseEntity<>(stats, stats != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 사용자가 해당 오염물질을 수집했는지 확인
	 * @param email 사용자 이메일
	 * @param polIdx 오염물질 인덱스
	 * @return 수집 여부
	 */
	@GetMapping("/users/{email}/pollutions/{polIdx}/collected")
	public ResponseEntity<Map<String, Object>> hasCollectedPollution(
			@PathVariable("email") String email, 
			@PathVariable("polIdx") Long polIdx) {
		try {
			boolean collected = gameService.hasCollectedPollution(email, polIdx);
			
			Map<String, Object> response = Map.of(
				"email", email,
				"polIdx", polIdx,
				"collected", collected
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "수집 여부 확인 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 게임 완료 후 통합 처리 (수집 데이터 + 통계 업데이트)
	 * @param email 사용자 이메일
	 * @param defeatedPollutants 처치한 오염물질 목록
	 * @return 처리 결과
	 */
	@PostMapping("/users/{email}/game-completion")
	public ResponseEntity<Map<String, Object>> processGameCompletion(
			@PathVariable("email") String email,
			@RequestBody List<Map<String, Object>> defeatedPollutants) {
		try {
			boolean success = gameService.saveGameResult(email, defeatedPollutants);
			
			Map<String, Object> response = Map.of(
				"success", success,
				"message", success ? "게임 완료 처리가 성공적으로 완료되었습니다." : "게임 완료 처리에 실패했습니다.",
				"processedCount", defeatedPollutants.size()
			);
			
			return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"success", false,
				"message", "게임 완료 처리 중 오류가 발생했습니다: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 디버깅용 간단한 테스트 API
	 * @param stageIdx 스테이지 인덱스
	 * @return 직접 생성한 설정 객체
	 */
	@GetMapping("/test/stage-config/{stageIdx}")
	public ResponseEntity<Map<String, Object>> testStageConfig(@PathVariable("stageIdx") Long stageIdx) {
		try {
			// 직접 객체 생성해서 테스트
			GameStageConfigVO testConfig = new GameStageConfigVO();
			testConfig.setStageIdx(stageIdx);
			testConfig.setGameIdx(1L);
			testConfig.setTimeLimit(60);
			testConfig.setInitialLives(3);
			testConfig.setPollutantSpawnRate(2.0);
			testConfig.setMaxPollutants(5);
			testConfig.setDifficultyMultiplier(1.0);
			testConfig.setTargetScore(1000 * stageIdx.intValue());
			
			Map<String, Object> response = Map.of(
				"testConfig", testConfig,
				"targetScore_direct", 1000 * stageIdx.intValue(),
				"stageIdx", stageIdx,
				"message", "직접 생성한 테스트 설정"
			);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			Map<String, Object> response = Map.of(
				"error", "테스트 중 오류: " + e.getMessage()
			);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
