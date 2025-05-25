package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CollectionDTO;
import com.example.demo.dto.CollectionDetailDTO;
import com.example.demo.mapper.CollectionMapper;
import com.example.demo.vo.PollutionsVO;
import com.example.demo.vo.UserCollectionVO;

import lombok.RequiredArgsConstructor;

/**
 * 오염물질 수집 관련 비즈니스 로직을 처리하는 서비스 구현체
 * 
 * 주요 기능:
 * 1. 전체 오염물질 목록 조회
 * 2. 사용자별 수집 목록 조회
 * 3. 오염물질 상세 정보 조회
 * 4. 수집 처리
 * 5. 도감 완성도 계산
 */
@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionMapper collectionMapper;

    /**
     * 전체 오염물질 목록을 조회
     * @return CollectionDTO - 전체 오염물질 목록과 수집 여부 정보
     */
    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getAllPollutions() {
        List<PollutionsVO> pollutions = collectionMapper.selectAllPollutions();
        return createCollectionDTO(pollutions, null);
    }

    /**
     * 특정 사용자의 수집 목록을 조회
     * @param email 사용자 이메일
     * @return CollectionDTO - 사용자의 수집 목록과 수집 여부 정보
     */
    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getUserCollections(String email) {
        List<PollutionsVO> pollutions = collectionMapper.selectAllPollutions();
        List<UserCollectionVO> userCollections = collectionMapper.selectUserCollections(email);
        return createCollectionDTO(pollutions, userCollections);
    }

    /**
     * 특정 오염물질의 상세 정보를 조회
     * @param polIdx 오염물질 인덱스
     * @return CollectionDetailDTO - 오염물질 상세 정보와 수집 여부
     */
    @Override
    @Transactional(readOnly = true)
    public CollectionDetailDTO getPollutionDetail(Long polIdx) {
        PollutionsVO pollution = collectionMapper.selectPollution(polIdx);
        UserCollectionVO userCollection = collectionMapper.selectUserCollection(polIdx);
        
        CollectionDetailDTO detail = new CollectionDetailDTO();
        detail.setPolIdx(pollution.getPolIdx());
        detail.setPolName(pollution.getPolName());
        detail.setPolDesc(pollution.getPolDesc());
        detail.setPolImg1(pollution.getPolImg1());
        detail.setPolImg2(pollution.getPolImg2());
        detail.setPolImg3(pollution.getPolImg3());
        detail.setType(pollution.getType());
        detail.setCollected(userCollection != null);
        if (userCollection != null) {
            detail.setCollectedAt(userCollection.getCollectedAt().toString());
        }
        
        return detail;
    }

    /**
     * 사용자의 도감 완성도 정보를 조회
     * @param email 사용자 이메일
     * @return CollectionDTO - 전체 목록, 수집 목록, 완성도 정보
     */
    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getCollectionCompletion(String email) {
        List<PollutionsVO> pollutions = collectionMapper.selectAllPollutions();
        List<UserCollectionVO> userCollections = collectionMapper.selectUserCollections(email);
        
        CollectionDTO dto = createCollectionDTO(pollutions, userCollections);
        dto.setTotalCount(pollutions.size());
        dto.setCollectedCount(userCollections.size());
        dto.setCompletionRate((double) userCollections.size() / pollutions.size() * 100);
        
        return dto;
    }

    /**
     * 전체 오염물질 목록을 VO로 조회
     * @return List<PollutionsVO> - 전체 오염물질 목록
     */
    @Override
    @Transactional(readOnly = true)
    public List<PollutionsVO> getPollutionsList() {
        return collectionMapper.selectAllPollutions();
    }

    /**
     * 사용자의 수집 목록을 VO로 조회
     * @param email 사용자 이메일
     * @return List<UserCollectionVO> - 사용자의 수집 목록
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserCollectionVO> getUserCollectionsList(String email) {
        return collectionMapper.selectUserCollections(email);
    }

    /**
     * 특정 오염물질 정보를 VO로 조회
     * @param polIdx 오염물질 인덱스
     * @return PollutionsVO - 오염물질 정보
     */
    @Override
    @Transactional(readOnly = true)
    public PollutionsVO getPollution(Long polIdx) {
        return collectionMapper.selectPollution(polIdx);
    }

    /**
     * 특정 사용자의 수집 정보를 VO로 조회
     * @param polIdx 오염물질 인덱스
     * @return UserCollectionVO - 사용자의 수집 정보
     */
    @Override
    @Transactional(readOnly = true)
    public UserCollectionVO getUserCollection(Long polIdx) {
        return collectionMapper.selectUserCollection(polIdx);
    }

    /**
     * 오염물질 수집 처리
     * @param email 사용자 이메일
     * @param polIdx 오염물질 인덱스
     * @return boolean - 수집 성공 여부
     */
    @Override
    @Transactional
    public boolean collectPollution(String email, Long polIdx) {
        if (collectionMapper.existsUserCollection(email, polIdx)) {
            return false;
        }
        return collectionMapper.insertUserCollection(email, polIdx) > 0;
    }

    /**
     * 사용자의 수집 완료율을 백분율로 계산
     * @param email 사용자 이메일
     * @return double - 수집 완료율 (0.0 ~ 100.0)
     */
    @Override
    @Transactional(readOnly = true)
    public double getCollectionCompletionRate(String email) {
        List<PollutionsVO> pollutions = collectionMapper.selectAllPollutions();
        List<UserCollectionVO> userCollections = collectionMapper.selectUserCollections(email);
        return (double) userCollections.size() / pollutions.size() * 100;
    }

    /**
     * PollutionsVO와 UserCollectionVO를 CollectionDTO로 변환하는 내부 메서드
     * @param pollutions 전체 오염물질 목록
     * @param userCollections 사용자의 수집 목록
     * @return CollectionDTO - 변환된 DTO 객체
     */
    private CollectionDTO createCollectionDTO(List<PollutionsVO> pollutions, List<UserCollectionVO> userCollections) {
        CollectionDTO dto = CollectionDTO.builder().build();
        
        List<CollectionDTO.PollutionDTO> pollutionDTOs = pollutions.stream()
            .map(p -> {
                CollectionDTO.PollutionDTO pollutionDTO = CollectionDTO.PollutionDTO.builder()
                    .polIdx(p.getPolIdx())
                    .polName(p.getPolName())
                    .polDesc(p.getPolDesc())
                    .polImg1(p.getPolImg1())
                    .polImg2(p.getPolImg2())
                    .polImg3(p.getPolImg3())
                    .type(p.getType())
                    .isCollected(userCollections != null && userCollections.stream()
                        .anyMatch(uc -> uc.getPolIdx().equals(p.getPolIdx())))
                    .build();
                
                return pollutionDTO;
            })
            .collect(Collectors.toList());
        
        dto.setPollutions(pollutionDTOs);
        return dto;
    }
} 