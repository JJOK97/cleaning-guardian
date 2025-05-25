package com.example.demo.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.PollutionsVO;
import com.example.demo.vo.UserCollectionVO;

@Mapper
public interface CollectionMapper {
    List<PollutionsVO> selectAllPollutions();
    List<UserCollectionVO> selectUserCollections(@Param("email") String email);
    PollutionsVO selectPollution(@Param("polIdx") Long polIdx);
    UserCollectionVO selectUserCollection(@Param("polIdx") Long polIdx);
    
    // 수집 관련 메서드 추가
    int insertUserCollection(@Param("email") String email, @Param("polIdx") Long polIdx);
    boolean existsUserCollection(@Param("email") String email, @Param("polIdx") Long polIdx);
    int getTotalPollutionsCount();
    int getUserCollectionsCount(@Param("email") String email);
    List<PollutionsVO> getUserCollectionDetails(@Param("email") String email);
} 