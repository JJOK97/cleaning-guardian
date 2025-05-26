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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.UserCollectionStatsService;
import com.example.demo.vo.UserCollectionStatsVO;

/**
 * 사용자 수집 통계 Controller
 * 
 * 게임 로직 개선을 위한 사용자별 오염물질 수집 통계 관리:
 * - 오염물질별 처치 횟수, 획득 점수, 최고 콤보 등
 * - 게임 결과와 연동하여 실시간 업데이트
 */
@RestController
@RequestMapping("/api/v1/collection-stats")
public class UserCollectionStatsController {

    @Autowired
    private UserCollectionStatsService userCollectionStatsService;

    /**
     * 사용자의 특정 오염물질 통계 조회
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 사용자 수집 통계 정보
     */
    @GetMapping("/users/{email}/pollutions/{polIdx}")
    public ResponseEntity<UserCollectionStatsVO> getUserPollutionStats(
            @PathVariable String email, 
            @PathVariable Long polIdx) {
        try {
            UserCollectionStatsVO stats = userCollectionStatsService.getUserPollutionStats(email, polIdx);
            return new ResponseEntity<>(stats, stats != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자의 모든 오염물질 통계 목록 조회
     * @param email 사용자 이메일
     * @return 사용자의 전체 수집 통계 목록
     */
    @GetMapping("/users/{email}")
    public ResponseEntity<List<UserCollectionStatsVO>> getUserAllStats(@PathVariable String email) {
        try {
            List<UserCollectionStatsVO> stats = userCollectionStatsService.getUserAllStats(email);
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 현재 로그인한 사용자의 모든 오염물질 통계 목록 조회
     * @param email 사용자 이메일 (헤더에서 추출)
     * @return 사용자의 전체 수집 통계 목록
     */
    @GetMapping("/my-stats")
    public ResponseEntity<List<UserCollectionStatsVO>> getMyStats(@RequestHeader("email") String email) {
        try {
            List<UserCollectionStatsVO> stats = userCollectionStatsService.getUserAllStats(email);
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 오염물질의 전체 사용자 통계 조회 (랭킹)
     * @param polIdx 오염물질 인덱스
     * @return 해당 오염물질의 전체 사용자 통계
     */
    @GetMapping("/pollutions/{polIdx}/ranking")
    public ResponseEntity<List<UserCollectionStatsVO>> getPollutionRanking(@PathVariable Long polIdx) {
        try {
            List<UserCollectionStatsVO> stats = userCollectionStatsService.getPollutionAllStats(polIdx);
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자의 총 처치 횟수 조회
     * @param email 사용자 이메일
     * @return 총 처치 횟수
     */
    @GetMapping("/users/{email}/total-defeated")
    public ResponseEntity<Map<String, Object>> getUserTotalDefeated(@PathVariable String email) {
        try {
            Integer totalDefeated = userCollectionStatsService.getUserTotalDefeated(email);
            
            Map<String, Object> response = Map.of(
                "email", email,
                "totalDefeated", totalDefeated
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "총 처치 횟수 조회 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자의 총 획득 점수 조회
     * @param email 사용자 이메일
     * @return 총 획득 점수
     */
    @GetMapping("/users/{email}/total-score")
    public ResponseEntity<Map<String, Object>> getUserTotalScore(@PathVariable String email) {
        try {
            Long totalScore = userCollectionStatsService.getUserTotalScore(email);
            
            Map<String, Object> response = Map.of(
                "email", email,
                "totalScore", totalScore
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "총 획득 점수 조회 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자의 최고 콤보 조회
     * @param email 사용자 이메일
     * @return 최고 콤보
     */
    @GetMapping("/users/{email}/max-combo")
    public ResponseEntity<Map<String, Object>> getUserMaxCombo(@PathVariable String email) {
        try {
            Integer maxCombo = userCollectionStatsService.getUserMaxCombo(email);
            
            Map<String, Object> response = Map.of(
                "email", email,
                "maxCombo", maxCombo
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "최고 콤보 조회 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자의 종합 통계 조회 (총 처치, 총 점수, 최고 콤보)
     * @param email 사용자 이메일
     * @return 종합 통계 정보
     */
    @GetMapping("/users/{email}/summary")
    public ResponseEntity<Map<String, Object>> getUserStatsSummary(@PathVariable String email) {
        try {
            Integer totalDefeated = userCollectionStatsService.getUserTotalDefeated(email);
            Long totalScore = userCollectionStatsService.getUserTotalScore(email);
            Integer maxCombo = userCollectionStatsService.getUserMaxCombo(email);
            
            Map<String, Object> response = Map.of(
                "email", email,
                "totalDefeated", totalDefeated,
                "totalScore", totalScore,
                "maxCombo", maxCombo,
                "averageScore", totalDefeated > 0 ? totalScore.doubleValue() / totalDefeated : 0.0
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "종합 통계 조회 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 게임 결과를 바탕으로 통계 업데이트 또는 생성
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @param defeatedCount 처치 횟수
     * @param scoreGained 획득 점수
     * @param maxCombo 최고 콤보
     * @return 처리 결과
     */
    @PostMapping("/process-game-stats")
    public ResponseEntity<Map<String, Object>> processGameStats(
            @RequestParam String email,
            @RequestParam Long polIdx,
            @RequestParam Integer defeatedCount,
            @RequestParam Long scoreGained,
            @RequestParam Integer maxCombo) {
        try {
            boolean success = userCollectionStatsService.processGameStats(email, polIdx, defeatedCount, scoreGained, maxCombo);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "게임 통계가 성공적으로 처리되었습니다." : "게임 통계 처리에 실패했습니다.",
                "email", email,
                "polIdx", polIdx,
                "defeatedCount", defeatedCount,
                "scoreGained", scoreGained,
                "maxCombo", maxCombo
            );
            
            return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "게임 통계 처리 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자 수집 통계 삭제 (관리자용)
     * @param statsIdx 통계 인덱스
     * @return 삭제 결과
     */
    @DeleteMapping("/{statsIdx}")
    public ResponseEntity<Map<String, Object>> deleteUserStats(@PathVariable Long statsIdx) {
        try {
            boolean success = userCollectionStatsService.deleteUserStats(statsIdx);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "사용자 통계가 성공적으로 삭제되었습니다." : "사용자 통계 삭제에 실패했습니다.",
                "statsIdx", statsIdx
            );
            
            return new ResponseEntity<>(response, success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "사용자 통계 삭제 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자 수집 통계 존재 여부 확인
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return 통계 존재 여부
     */
    @GetMapping("/users/{email}/pollutions/{polIdx}/exists")
    public ResponseEntity<Map<String, Object>> existsUserStats(
            @PathVariable String email, 
            @PathVariable Long polIdx) {
        try {
            boolean exists = userCollectionStatsService.existsUserStats(email, polIdx);
            
            Map<String, Object> response = Map.of(
                "email", email,
                "polIdx", polIdx,
                "exists", exists
            );
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "error", "통계 존재 여부 확인 중 오류가 발생했습니다: " + e.getMessage()
            );
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 