package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameItemVO {
    
	private Long itemIdx;
    
    private Long gameIdx;
    
    private String itemName;
    
    private String itemDesc;
    
    private String itemImg;
    
    private Long itemPrice;
    
    private String priceType;

}
