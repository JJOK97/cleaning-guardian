package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CollectionDTO;
import com.example.demo.dto.CollectionDetailDTO;
import com.example.demo.mapper.CollectionMapper;
import com.example.demo.vo.PollutionVO;
import com.example.demo.vo.UserCollectionVO;

@Service
public class CollectionServiceImpl implements CollectionService {

    @Autowired
    private CollectionMapper collectionMapper;

    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getAllPollutions() {
        List<PollutionVO> pollutions = collectionMapper.selectAllPollutions();
        return createCollectionDTO(pollutions, null);
    }

    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getUserCollections(String email) {
        List<PollutionVO> pollutions = collectionMapper.selectAllPollutions();
        List<UserCollectionVO> userCollections = collectionMapper.selectUserCollections(email);
        return createCollectionDTO(pollutions, userCollections);
    }

    @Override
    @Transactional(readOnly = true)
    public CollectionDetailDTO getPollutionDetail(Long polIdx) {
        PollutionVO pollution = collectionMapper.selectPollution(polIdx);
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

    @Override
    @Transactional(readOnly = true)
    public CollectionDTO getCollectionCompletion(String email) {
        List<PollutionVO> pollutions = collectionMapper.selectAllPollutions();
        List<UserCollectionVO> userCollections = collectionMapper.selectUserCollections(email);
        
        CollectionDTO dto = createCollectionDTO(pollutions, userCollections);
        dto.setTotalCount(pollutions.size());
        dto.setCollectedCount(userCollections.size());
        dto.setCompletionRate((double) userCollections.size() / pollutions.size() * 100);
        
        return dto;
    }

    private CollectionDTO createCollectionDTO(List<PollutionVO> pollutions, List<UserCollectionVO> userCollections) {
        CollectionDTO dto = new CollectionDTO();
        
        List<CollectionDTO.PollutionDTO> pollutionDTOs = pollutions.stream()
            .map(p -> {
                CollectionDTO.PollutionDTO pollutionDTO = new CollectionDTO.PollutionDTO();
                pollutionDTO.setPolIdx(p.getPolIdx());
                pollutionDTO.setPolName(p.getPolName());
                pollutionDTO.setPolDesc(p.getPolDesc());
                pollutionDTO.setPolImg1(p.getPolImg1());
                pollutionDTO.setPolImg2(p.getPolImg2());
                pollutionDTO.setPolImg3(p.getPolImg3());
                pollutionDTO.setType(p.getType());
                
                if (userCollections != null) {
                    pollutionDTO.setCollected(userCollections.stream()
                        .anyMatch(uc -> uc.getPolIdx().equals(p.getPolIdx())));
                }
                
                return pollutionDTO;
            })
            .collect(Collectors.toList());
        
        dto.setPollutions(pollutionDTOs);
        return dto;
    }
} 