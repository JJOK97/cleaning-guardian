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
} 