package com.example.demo.service;

import com.example.demo.dto.BalanceResponseDTO;
import com.example.demo.dto.ProfilesDTO;
import com.example.demo.dto.UserInfoResponseDTO;

public interface UserService {
    
    UserInfoResponseDTO getUserInfo(String token);
    
    BalanceResponseDTO getUserBalance(String token);

	ProfilesDTO getAllProfiles();

	ProfilesDTO getProfile(long profileIdx);

	UserInfoResponseDTO patchProfile(String email, long profileIdx);
}