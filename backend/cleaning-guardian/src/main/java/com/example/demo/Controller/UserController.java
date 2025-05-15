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
    // register 명령을 받았을 때 실행하라 > post 보내라
	@PostMapping("/register")
	// 객체 만들기 string 값이 들어가는 register 메소드선언. 매개변수는 user
	// @RequestBody == 사용자가 준 JSON 타입의 데이터를 JAVA에서 이해할 수 있게 만들어 준다.
	// 그 데이터를 UserDTO 형식의 user로 받아오게 한다.
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
