package com.example.demo.mapper;

import com.example.demo.vo.BalanceVO;

public interface BalanceMapper {

	BalanceVO findByEmail(String email);

}
