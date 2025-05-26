package com.example.demo.service;

import java.util.List;

import com.example.demo.vo.GameStageConfigVO;

/**
 * 스테이지별 게임 설정 Service
 * 
 * 게임 로직 개선을 위한 스테이지별 게임 설정 관리:
 * - 제한 시간, 초기 생명력, 오염물질 생성 주기 등
 * - 스테이지별로 다른 게임 난이도와 설정 적용
 */
public interface GameStageConfigService {
    
    /**
     * 특정 스테이지의 게임 설정 조회
     * @param stageIdx 스테이지 인덱스
     * @return 스테이지 게임 설정 정보
     */
    GameStageConfigVO getStageConfig(Long stageIdx);
    
    /**
     * 모든 스테이지 게임 설정 목록 조회
     * @return 전체 스테이지 게임 설정 목록
     */
    List<GameStageConfigVO> getAllStageConfigs();
    
    /**
     * 특정 게임의 스테이지 설정 목록 조회
     * @param gameIdx 게임 인덱스
     * @return 해당 게임의 스테이지 설정 목록
     */
    List<GameStageConfigVO> getStageConfigsByGame(Long gameIdx);
    
    /**
     * 스테이지 게임 설정 추가
     * @param config 스테이지 게임 설정 정보
     * @return 추가 성공 여부
     */
    boolean createStageConfig(GameStageConfigVO config);
    
    /**
     * 스테이지 게임 설정 수정
     * @param config 수정할 스테이지 게임 설정 정보
     * @return 수정 성공 여부
     */
    boolean updateStageConfig(GameStageConfigVO config);
    
    /**
     * 스테이지 게임 설정 삭제
     * @param configIdx 설정 인덱스
     * @return 삭제 성공 여부
     */
    boolean deleteStageConfig(Long configIdx);
    
    /**
     * 특정 스테이지의 설정 존재 여부 확인
     * @param stageIdx 스테이지 인덱스
     * @return 설정 존재 여부
     */
    boolean existsStageConfig(Long stageIdx);
    
    /**
     * 기본 스테이지 설정 생성 (설정이 없는 경우)
     * @param stageIdx 스테이지 인덱스
     * @param gameIdx 게임 인덱스
     * @return 생성된 기본 설정
     */
    GameStageConfigVO createDefaultStageConfig(Long stageIdx, Long gameIdx);
    
} 