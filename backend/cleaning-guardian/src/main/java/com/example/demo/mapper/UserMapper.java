package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.UserVO;

@Mapper
public interface UserMapper {
    
    UserVO findByEmail(String email);
    
    int insertUser(UserVO user);
}