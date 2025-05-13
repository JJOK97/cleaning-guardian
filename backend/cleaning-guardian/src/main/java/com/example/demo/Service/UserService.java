package com.example.demo.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.example.demo.DTO.UserDTO;


@Service
public class UserService {
	
	private final Map<String, UserDTO> userStore = new ConcurrentHashMap<>();


	public boolean register(UserDTO user) {
		if (userStore.containsKey(user.getUserLoginId())){
			return false;
		}
		else {
			return true;
		}
		
	}
	
	public boolean login(UserDTO user) {
		if (userStore.containsKey(user.getUserLoginId())){
			return true;
		}
		else {
			return false;
		}
	}
//	public boolean check_id(String userLoginId){
//		
//	}
//	
}
