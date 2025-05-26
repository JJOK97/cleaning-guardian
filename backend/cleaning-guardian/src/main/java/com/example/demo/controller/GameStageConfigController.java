package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.GameStageConfigService;
import com.example.demo.vo.GameStageConfigVO;

/**
 * 스테이지별 게임 설정 Controller
 * 
 * 게임 로직 개선을 위한 스테이지별 게임 설정 관리:
 * - 제한 시간, 초기 생명력, 오염물질 생성 주기 등
 * - 스테이지별로 다른 게임 난이도와 설정 적용
 */
@RestController
@RequestMapping("/api/v1/stage-configs")
public class GameStageConfigController {

    @Autowired
    private GameStageConfigService gameStageConfigService;

    /**
     * 특정 스테이지의 게임 설정 조회
     * @param stageIdx 스테이지 인덱스
     * @return 스테이지 게임 설정 정보
     */
    @GetMapping("/stages/{stageIdx}")
    public ResponseEntity<GameStageConfigVO> getStageConfig(@PathVariable Long stageIdx) {
        try {
            GameStageConfigVO config = gameStageConfigService.getStageConfig(stageIdx);
            return new ResponseEntity<>(config, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 모든 스테이지 게임 설정 목록 조회
     * @return 전체 스테이지 게임 설정 목록
     */
    @GetMapping
    public ResponseEntity<List<GameStageConfigVO>> getAllStageConfigs() {
        try {
            List<GameStageConfigVO> configs = gameStageConfigService.getAllStageConfigs();
            return new ResponseEntity<>(configs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 게임의 스테이지 설정 목록 조회
     * @param gameIdx 게임 인덱스
     * @return 해당 게임의 스테이지 설정 목록
     */
    @GetMapping("/games/{gameIdx}")
    public ResponseEntity<List<GameStageConfigVO>> getStageConfigsByGame(@PathVariable Long gameIdx) {
        try {
            List<GameStageConfigVO> configs = gameStageConfigService.getStageConfigsByGame(gameIdx);
            return new ResponseEntity<>(configs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 스테이지 게임 설정 추가
     * @param config 스테이지 게임 설정 정보
     * @return 추가 결과
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createStageConfig(@RequestBody GameStageConfigVO config) {
        try {
            boolean success = gameStageConfigService.createStageConfig(config);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "스테이지 설정이 성공적으로 생성되었습니다." : "스테이지 설정 생성에 실패했습니다.",
                "stageIdx", config.getStageIdx()
            );
            
            return new ResponseEntity<>(response, success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "스테이지 설정 생성 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 스테이지 게임 설정 수정
     * @param configIdx 설정 인덱스
     * @param config 수정할 스테이지 게임 설정 정보
     * @return 수정 결과
     */
    @PutMapping("/{configIdx}")
    public ResponseEntity<Map<String, Object>> updateStageConfig(
            @PathVariable Long configIdx, 
            @RequestBody GameStageConfigVO config) {
        try {
            config.setConfigIdx(configIdx);
            boolean success = gameStageConfigService.updateStageConfig(config);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "스테이지 설정이 성공적으로 수정되었습니다." : "스테이지 설정 수정에 실패했습니다.",
                "configIdx", configIdx
            );
            
            return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "스테이지 설정 수정 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 스테이지 게임 설정 삭제
     * @param configIdx 설정 인덱스
     * @return 삭제 결과
     */
    @DeleteMapping("/{configIdx}")
    public ResponseEntity<Map<String, Object>> deleteStageConfig(@PathVariable Long configIdx) {
        try {
            boolean success = gameStageConfigService.deleteStageConfig(configIdx);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "스테이지 설정이 성공적으로 삭제되었습니다." : "스테이지 설정 삭제에 실패했습니다.",
                "configIdx", configIdx
            );
            
            return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "스테이지 설정 삭제 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 스테이지의 설정 존재 여부 확인
     * @param stageIdx 스테이지 인덱스
     * @return 설정 존재 여부
     */
    @GetMapping("/stages/{stageIdx}/exists")
    public ResponseEntity<Map<String, Object>> existsStageConfig(@PathVariable Long stageIdx) {
        try {
            boolean exists = gameStageConfigService.existsStageConfig(stageIdx);
            
            Map<String, Object> response = Map.of(
                "stageIdx", stageIdx,
                "exists", exists
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "설정 존재 여부 확인 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 기본 스테이지 설정 생성 (설정이 없는 경우)
     * @param stageIdx 스테이지 인덱스
     * @param gameIdx 게임 인덱스 (선택사항, 기본값: 1)
     * @return 생성된 기본 설정
     */
    @PostMapping("/stages/{stageIdx}/default")
    public ResponseEntity<GameStageConfigVO> createDefaultStageConfig(
            @PathVariable Long stageIdx,
            @RequestParam(defaultValue = "1") Long gameIdx) {
        try {
            GameStageConfigVO defaultConfig = gameStageConfigService.createDefaultStageConfig(stageIdx, gameIdx);
            return new ResponseEntity<>(defaultConfig, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 