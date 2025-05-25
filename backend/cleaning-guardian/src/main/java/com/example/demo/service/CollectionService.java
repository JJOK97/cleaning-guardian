package com.example.demo.service;

import java.util.List;
import com.example.demo.dto.CollectionDTO;
import com.example.demo.dto.CollectionDetailDTO;
import com.example.demo.vo.PollutionsVO;
import com.example.demo.vo.UserCollectionVO;

public interface CollectionService {
    // DTO 반환 메서드
    CollectionDTO getAllPollutions();
    CollectionDTO getUserCollections(String email);
    CollectionDetailDTO getPollutionDetail(Long polIdx);
    CollectionDTO getCollectionCompletion(String email);
    
    // VO 반환 메서드
    List<PollutionsVO> getPollutionsList();
    List<UserCollectionVO> getUserCollectionsList(String email);
    PollutionsVO getPollution(Long polIdx);
    UserCollectionVO getUserCollection(Long polIdx);
    
    // 수집 관련 메서드
    boolean collectPollution(String email, Long polIdx);
    double getCollectionCompletionRate(String email);
} 