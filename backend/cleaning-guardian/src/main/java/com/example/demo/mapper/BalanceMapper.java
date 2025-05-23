package com.example.demo.mapper;

import com.example.demo.vo.BalanceVO;

public interface BalanceMapper {

	BalanceVO findByEmail(String email);

	int decreasePoint(String email, long amount);

	int increasePoint(String email, long amount);

	int decreaseCash(String email, long amount);

	int increaseCash(String email, long amount);

}
