package com.example.demo.util;

import java.util.Base64;
import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {
    
    public String generateToken(String email, String deviceId) {
        String base = email + ":" + deviceId + ":" + System.currentTimeMillis();
        String encodedBase = Base64.getEncoder().encodeToString(base.getBytes());
        
        String header = Base64.getEncoder().encodeToString("{\"typ\":\"JWT\"}".getBytes());
        String signature = deviceId.substring(0, Math.min(deviceId.length(), 20));
        
        return header + "." + encodedBase + "." + signature;
    }
}