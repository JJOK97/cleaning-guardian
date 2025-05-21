package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.dto.ProfilesDTO;
import com.example.demo.vo.ProfilesVO;
import com.example.demo.vo.UserVO;

@Mapper
public interface UserMapper {
    
    UserVO findByEmail(String email);
    
    int insertUser(UserVO user);

	List<ProfilesVO> getAllProfiles();

	ProfilesVO getProfile(long profileIdx);
}