package com.example.demo.vo;

import java.security.PrivateKey;
import java.security.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserItemVO {
		
	    private Long uskinIdx;
	    
	    private String email;
	    
	    private Long skinIdx;
	    
	    private String getType;
	    
	    private Timestamp createdAt;
	}


	

