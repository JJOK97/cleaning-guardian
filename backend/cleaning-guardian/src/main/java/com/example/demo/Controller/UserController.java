package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.UserService;
import com.example.demo.DTO.UserDTO;

import io.swagger.v3.oas.annotations.parameters.RequestBody;


@RestController
@RequestMapping("/api/users")
public class UserController {
	
	UserDTO User = new UserDTO();
	
	@Autowired
	UserService userservice;

    @GetMapping("/")
    public String main() {
        return "Cleaning Guardian API!";
    }

	// 회원가입
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody UserDTO user) {
		boolean result = userservice.register(user);
		if (result == true) {
			return ResponseEntity.ok().body("확인");
		} else {
			return ResponseEntity.badRequest().body("바보");
		}
	}
	
//	 로그인(자동로그인)
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody UserDTO user) {
		boolean result = userservice.login(user);
		if (result == true) {
			return ResponseEntity.ok().body("확인");
		} else {
			return ResponseEntity.badRequest().body("바보");
		}
	}
	
	// 아이디 중복 확인
//	@GetMapping("/check")
//	public ResponseEntity<String> checkId(@RequestBody UserDTO user){
//		
//	}
	
    

}
