package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MissionClearDTO;
import com.example.demo.dto.MissionsDTO;
import com.example.demo.service.MissionsServiceImpl;

@RestController
@RequestMapping("/api/v1")
public class MissionsController {

	@Autowired
	MissionsServiceImpl missionsservice;

	@GetMapping("/missions")
	public ResponseEntity<MissionsDTO> getAllMissions() {
		MissionsDTO missions = missionsservice.getAllMissions();
		return new ResponseEntity<>(missions, HttpStatus.OK);
	}

	@PostMapping("/missions/{missionIdx}/complete")
	public ResponseEntity<MissionClearDTO> MissionClear(@PathVariable("missionIdx") long missionIdx, @RequestParam("email") String email) {
		MissionClearDTO missionClear = missionsservice.MissionClear(missionIdx, email);
		return new ResponseEntity<>(missionClear, HttpStatus.OK);
	}

}
