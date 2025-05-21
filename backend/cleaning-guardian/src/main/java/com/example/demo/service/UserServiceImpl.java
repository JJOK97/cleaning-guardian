package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.BalanceResponseDTO;
import com.example.demo.dto.ProfilesDTO;
import com.example.demo.dto.UserInfoResponseDTO;
import com.example.demo.mapper.BalanceMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.mapper.UserTokenMapper;
import com.example.demo.vo.BalanceVO;
import com.example.demo.vo.ProfilesVO;
import com.example.demo.vo.UserTokenVO;
import com.example.demo.vo.UserVO;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private UserTokenMapper userTokenMapper;
    
    @Autowired
    private BalanceMapper balanceMapper;
    
    @Override
    public UserInfoResponseDTO getUserInfo(String token) {
        // 토큰에서 사용자 이메일 추출
        String email = extractEmailFromToken(token);
        
        if (email == null) {
            return UserInfoResponseDTO.builder()
                    .success(false)
                    .message("유효하지 않은 토큰입니다.")
                    .build();
        }
        
        // 사용자 정보 조회
        UserVO user = userMapper.findByEmail(email);
        
        if (user == null) {
            return UserInfoResponseDTO.builder()
                    .success(false)
                    .message("사용자를 찾을 수 없습니다.")
                    .build();
        }
        
        // 응답 데이터 구성
        return UserInfoResponseDTO.builder()
                .success(true)
                .message("사용자 정보 조회 성공")
                .email(user.getEmail())
                .nickname(user.getNickname())
                .joinedAt(user.getJoinedAt())
                .build();
    }

    @Override
    public BalanceResponseDTO getUserBalance(String token) {
        // 토큰에서 사용자 이메일 추출
        String email = extractEmailFromToken(token);
        
        if (email == null) {
            return BalanceResponseDTO.builder()
                    .success(false)
                    .message("유효하지 않은 토큰입니다.")
                    .build();
        }
        
        // 사용자 잔액 정보 조회
        BalanceVO balance = balanceMapper.findByEmail(email);
        
        if (balance == null) {
            return BalanceResponseDTO.builder()
                    .success(false)
                    .message("잔액 정보를 찾을 수 없습니다.")
                    .build();
        }
        
        // 응답 데이터 구성
        return BalanceResponseDTO.builder()
                .success(true)
                .message("잔액 조회 성공")
                .email(email)
                .point(balance.getPoint())
                .cash(balance.getCash())
                .build();
    }
    
    // 토큰에서 이메일 추출하는 메소드
    private String extractEmailFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // 토큰으로 사용자 정보 조회
        UserTokenVO userToken = userTokenMapper.findByToken(token);
        
        if (userToken != null && userToken.getIsValid() == 'Y') {
            return userToken.getEmail();
        }
        
        return null;
    }

	@Override
	public ProfilesDTO getAllProfiles() {
		List<ProfilesVO> profileList = userMapper.getAllProfiles();
		
		if (profileList == null) {
			return ProfilesDTO.builder().success(false).message("프로필을 불러오는데 실패했습니다.").build();
		}
		return ProfilesDTO.builder().success(true).message("전체 프로필 조회 성공").profilesList(profileList).build();
	}
}	