//package com.example.demo.mapper;
//
//import org.apache.ibatis.annotations.Mapper;
//import org.apache.ibatis.annotations.Param;
//
//import com.example.demo.vo.GameItemVO;
//import com.example.demo.vo.UserItemVO;
//
//@Mapper
//public interface PurchaseeMapper {
//	GameItemVO selectItemById(Long itemIdx);
//	
//	Long selectUserBalance(String email);
//
//    UserItemVO selectUserItem(String email, Long skinIdx);
//
//    void insertUserItem(UserItemVO userItem);
//
//    void updateUserItem(UserItemVO userItem);
//
//    void updateUserBalance(@Param("email") String email, @Param("amount") Long amount);
//
//    void insertReceipt(@Param("email") String email, @Param("amount") Long amount, @Param("cashType") String cashType, @Param("ioType") String ioType);
//}
//
//
