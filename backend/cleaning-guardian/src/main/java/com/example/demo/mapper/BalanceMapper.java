package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.example.demo.vo.BalanceVO;

@Mapper
public interface BalanceMapper {
    
    BalanceVO findByEmail(String email);
}