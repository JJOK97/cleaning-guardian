package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.BalanceResponseDTO;
import com.example.demo.dto.ProfilesDTO;
import com.example.demo.dto.UserInfoResponseDTO;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponseDTO> getUserInfo(@RequestHeader("Authorization") String token) {
        UserInfoResponseDTO response = userService.getUserInfo(token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/me/balance")
    public ResponseEntity<BalanceResponseDTO> getUserBalance(@RequestHeader("Authorization") String token) {
        BalanceResponseDTO response = userService.getUserBalance(token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/me/profile")
    public ResponseEntity<ProfilesDTO> getAllProfiles() {
    	ProfilesDTO profiles = userService.getAllProfiles();
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }
    
    @GetMapping("/me/profile/{profileIdx}")
    public ResponseEntity<ProfilesDTO> getProfile(@PathVariable long profileIdx) {
    	ProfilesDTO profile = userService.getProfile(profileIdx);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }
    
    @PatchMapping("/me/profile/{email}")
    public ResponseEntity<UserInfoResponseDTO> patchProfile(@PathVariable String email, @RequestParam long profileIdx){
    	UserInfoResponseDTO userProfile = userService.patchProfile(email, profileIdx);
    	return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }
    
    
}