package com.example.demo.service;

import com.example.demo.dto.BalanceResponseDTO;
import com.example.demo.dto.UserInfoResponseDTO;

public interface UserService {
    
    UserInfoResponseDTO getUserInfo(String token);
    
    BalanceResponseDTO getUserBalance(String token);
}