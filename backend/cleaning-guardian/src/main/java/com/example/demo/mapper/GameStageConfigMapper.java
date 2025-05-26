package com.example.demo.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.GameStageConfigVO;

/**
 * 스테이지별 게임 설정 Mapper
 * 
 * 게임 로직 개선을 위한 스테이지별 게임 설정 관리:
 * - 제한 시간, 초기 생명력, 오염물질 생성 주기 등
 * - 스테이지별로 다른 게임 난이도와 설정 적용
 */
@Mapper
public interface GameStageConfigMapper {
    
    /**
     * 특정 스테이지의 게임 설정 조회
     * @param stageIdx 스테이지 인덱스
     * @return 스테이지 게임 설정 정보
     */
    GameStageConfigVO getStageConfig(@Param("stageIdx") Long stageIdx);
    
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
    List<GameStageConfigVO> getStageConfigsByGame(@Param("gameIdx") Long gameIdx);
    
    /**
     * 스테이지 게임 설정 추가
     * @param config 스테이지 게임 설정 정보
     * @return 추가된 행 수
     */
    int insertStageConfig(GameStageConfigVO config);
    
    /**
     * 스테이지 게임 설정 수정
     * @param config 수정할 스테이지 게임 설정 정보
     * @return 수정된 행 수
     */
    int updateStageConfig(GameStageConfigVO config);
    
    /**
     * 스테이지 게임 설정 삭제
     * @param configIdx 설정 인덱스
     * @return 삭제된 행 수
     */
    int deleteStageConfig(@Param("configIdx") Long configIdx);
    
    /**
     * 특정 스테이지의 설정 존재 여부 확인
     * @param stageIdx 스테이지 인덱스
     * @return 설정 존재 여부
     */
    boolean existsStageConfig(@Param("stageIdx") Long stageIdx);
    
} 