package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.UserTokenVO;

@Mapper
public interface UserTokenMapper {
    
    UserTokenVO findByDeviceIdAndToken(@Param("deviceId") String deviceId, @Param("accessToken") String accessToken);
    
    UserTokenVO findByToken(String accessToken);
    
    int insertToken(UserTokenVO token);
    
    int invalidateTokens(@Param("email") String email, @Param("deviceId") String deviceId);
}