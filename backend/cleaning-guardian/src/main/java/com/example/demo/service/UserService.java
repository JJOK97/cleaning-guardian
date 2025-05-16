package com.example.demo.service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.example.demo.dto.UserDTO;


@Service
public class UserService {
	
	private final Map<String, UserDTO> userStore = new ConcurrentHashMap<>();


	public boolean register(UserDTO user) {
		if (userStore.containsKey(user.getEmail())){
			return false;
		}
		else {
			userStore.put(user.getEmail(), user);
			return true;
		}
		
	}
	
	public boolean login(UserDTO user) {
		// userStore map에 있는 key 값들 중에 user가 입력한 email을 getEmail 해와라.
		// 있으면 그 값을 checkUser에 담고 없으면 null값으로 담아진다.
		UserDTO checkUser = userStore.get(user.getEmail());
		
		// checkUser 의 key 값이 있냐 없냐 == 만들어진 email이 있냐? null이면 없다. 일치값이. == 있어야 로그인 가능
		// 그리고, checkUser의 password값이랑 그 user의 password값이랑 같냐?
		if (checkUser != null && checkUser.getPassword().equals(user.getPassword())){
			return true;
		}
		else {
			return false;
		}
	}
	
}
