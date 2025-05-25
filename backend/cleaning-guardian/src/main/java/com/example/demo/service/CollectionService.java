package com.example.demo.service;

import com.example.demo.dto.CollectionDTO;
import com.example.demo.dto.CollectionDetailDTO;

public interface CollectionService {
    CollectionDTO getAllPollutions();
    CollectionDTO getUserCollections(String email);
    CollectionDetailDTO getPollutionDetail(Long polIdx);
    CollectionDTO getCollectionCompletion(String email);
} 