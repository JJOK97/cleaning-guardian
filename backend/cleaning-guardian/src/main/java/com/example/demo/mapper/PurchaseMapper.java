package com.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.example.demo.vo.BalanceVO;

@Mapper
public interface PurchaseMapper {
    
    BalanceVO findByEmail(String email);
}