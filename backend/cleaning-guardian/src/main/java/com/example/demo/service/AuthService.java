package com.example.demo.service;

import com.example.demo.dto.AuthRequestDTO;
import com.example.demo.dto.AuthResponseDTO;

public interface AuthService {
    
    AuthResponseDTO signup(AuthRequestDTO request);
    
    AuthResponseDTO login(AuthRequestDTO request);
    
    AuthResponseDTO verifyToken(String uuid, String token);
}