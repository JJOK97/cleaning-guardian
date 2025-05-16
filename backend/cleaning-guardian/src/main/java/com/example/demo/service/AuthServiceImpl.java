package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AuthRequestDTO;
import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.mapper.UserMapper;
import com.example.demo.mapper.UserTokenMapper;
import com.example.demo.util.PasswordEncoder;
import com.example.demo.util.TokenGenerator;
import com.example.demo.vo.UserTokenVO;
import com.example.demo.vo.UserVO;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private UserTokenMapper userTokenMapper;
    
    @Autowired
    private TokenGenerator tokenGenerator;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public AuthResponseDTO signup(AuthRequestDTO request) {
        AuthResponseDTO response = new AuthResponseDTO();
        
        // 이메일 중복 확인
        UserVO existingUser = userMapper.findByEmail(request.getEmail());
        if (existingUser != null) {
            response.setSuccess(false);
            response.setMessage("이미 등록된 이메일입니다.");
            return response;
        }
        
        // 사용자 등록 - 비밀번호 암호화 적용
        UserVO newUser = new UserVO();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setNickname(request.getNickname());
        newUser.setJoinedAt(LocalDateTime.now());
        
        userMapper.insertUser(newUser);
        
        response.setSuccess(true);
        response.setMessage("회원가입이 완료되었습니다.");
        response.setEmail(newUser.getEmail());
        response.setNickname(newUser.getNickname());
        
        return response;
    }

    @Override
    @Transactional
    public AuthResponseDTO login(AuthRequestDTO request) {
        AuthResponseDTO response = new AuthResponseDTO();
        
        // 사용자 확인
        UserVO user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            response.setSuccess(false);
            response.setMessage("등록되지 않은 이메일입니다.");
            return response;
        }
        
        // 비밀번호 확인 - BCrypt 비교 메소드 사용
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) { 
            response.setSuccess(false);
            response.setMessage("비밀번호가 일치하지 않습니다.");
            return response;
        }
        
        // 기존 토큰 비활성화
        userTokenMapper.invalidateTokens(user.getEmail(), request.getDeviceId());
        
        // 새 토큰 생성 (클라이언트에서 보낸 deviceId 사용)
        String accessToken = tokenGenerator.generateToken(user.getEmail(), request.getDeviceId());
        
        UserTokenVO token = new UserTokenVO();
        token.setEmail(user.getEmail());
        token.setDeviceId(request.getDeviceId());
        token.setAccessToken(accessToken);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiredAt(LocalDateTime.now().plusDays(5)); // 5일 유효
        token.setIsValid('Y');
        
        userTokenMapper.insertToken(token);
        
        response.setSuccess(true);
        response.setMessage("로그인이 성공했습니다.");
        response.setEmail(user.getEmail());
        response.setNickname(user.getNickname());
        response.setAccessToken(accessToken);
        
        return response;
    }

    @Override
    public AuthResponseDTO verifyToken(String uuid, String token) {
        AuthResponseDTO response = new AuthResponseDTO();
        
        UserTokenVO userToken = userTokenMapper.findByDeviceIdAndToken(uuid, token);
        
        if (userToken == null || userToken.getIsValid() != 'Y' || userToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            response.setSuccess(false);
            response.setMessage("유효하지 않은 토큰입니다.");
            return response;
        }
        
        UserVO user = userMapper.findByEmail(userToken.getEmail());
        
        response.setSuccess(true);
        response.setMessage("유효한 토큰입니다.");
        response.setEmail(user.getEmail());
        response.setNickname(user.getNickname());
        
        return response;
    }
}