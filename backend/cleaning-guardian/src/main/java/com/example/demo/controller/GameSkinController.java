package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserSkinDTO;
import com.example.demo.service.GameSkinService;
import com.example.demo.vo.GameSkinVO;
import com.example.demo.vo.UserSkinVO;

@RestController
@RequestMapping("/api/v1/skins")
public class GameSkinController {

	@Autowired
	private GameSkinService skinService;

	@GetMapping("/{skinIdx}")
	public GameSkinVO getSkin(@PathVariable long skinIdx) {
		return skinService.getSkin(skinIdx);
	}

	@GetMapping("/user")
	public List<UserSkinVO> getUserSkins(@RequestParam String email) {
		return skinService.getUserSkins(email);
	}

	@GetMapping("/user/{skinIdx}")
	public UserSkinVO getUserSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.getUserSkin(email, skinIdx);
	}

	// 슬라이스 스킨 조회
	@GetMapping("/slice")
	public List<GameSkinVO> getAllSliceSkins() {
		return skinService.getAllSliceSkins();
	}

	@GetMapping("/slice/{skinIdx}")
	public GameSkinVO getSliceSkin(@PathVariable long skinIdx) {
		return skinService.getSliceSkin(skinIdx);
	}

	@GetMapping("/slice/user")
	public UserSkinDTO getUserSliceSkins(@RequestParam String email) {
		List<UserSkinVO> userSkins = skinService.getUserSliceSkins(email);
		return UserSkinDTO.builder()
				.userSkinList(userSkins)
				.success(true)
				.build();
	}

	@GetMapping("/slice/user/{skinIdx}")
	public UserSkinVO getUserSliceSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.getUserSliceSkin(email, skinIdx);
	}

	@GetMapping("/slice/equipped")
	public UserSkinVO getEquippedSliceSkin(@RequestParam String email) {
		return skinService.getEquippedSliceSkin(email);
	}

	// 탭 스킨 조회
	@GetMapping("/tap")
	public List<GameSkinVO> getAllTapSkins() {
		return skinService.getAllTapSkins();
	}

	@GetMapping("/tap/{skinIdx}")
	public GameSkinVO getTapSkin(@PathVariable long skinIdx) {
		return skinService.getTapSkin(skinIdx);
	}

	@GetMapping("/tap/user")
	public UserSkinDTO getUserTapSkins(@RequestParam String email) {
		List<UserSkinVO> userSkins = skinService.getUserTapSkins(email);
		return UserSkinDTO.builder()
				.userSkinList(userSkins)
				.success(true)
				.build();
	}

	@GetMapping("/tap/user/{skinIdx}")
	public UserSkinVO getUserTapSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.getUserTapSkin(email, skinIdx);
	}

	@GetMapping("/tap/equipped")
	public UserSkinVO getEquippedTapSkin(@RequestParam String email) {
		return skinService.getEquippedTapSkin(email);
	}

	// 캐시/포인트 스킨 조회
	@GetMapping("/cash")
	public List<GameSkinVO> getCashSkins() {
		return skinService.getCashSkins();
	}

	@GetMapping("/point")
	public List<GameSkinVO> getPointSkins() {
		return skinService.getPointSkins();
	}

	@GetMapping("/cash/slice")
	public List<GameSkinVO> getCashSliceSkins() {
		return skinService.getCashSliceSkins();
	}

	@GetMapping("/cash/tap")
	public List<GameSkinVO> getCashTapSkins() {
		return skinService.getCashTapSkins();
	}

	@GetMapping("/point/slice")
	public List<GameSkinVO> getPointSliceSkins() {
		return skinService.getPointSliceSkins();
	}

	@GetMapping("/point/tap")
	public List<GameSkinVO> getPointTapSkins() {
		return skinService.getPointTapSkins();
	}

	// 스킨 장착/해제
	@PostMapping("/equip/{skinIdx}")
	public String equipSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.equipSkin(email, skinIdx);
	}

	@PostMapping("/unequip/{skinIdx}")
	public String unequipSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.unequipSkin(email, skinIdx);
	}

	// 스킨 구매
	@PostMapping("/purchase/{skinIdx}")
	public String purchaseSkin(@RequestParam String email, @PathVariable long skinIdx) {
		return skinService.purchaseSkin(email, skinIdx);
	}

	
}
