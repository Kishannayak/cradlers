package com.cradlers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * OTP Code entity for storing OTP codes temporarily
 */
@Document(collection = "otp_codes")
@CompoundIndex(name = "idx_phone_code", def = "{'phone': 1, 'code': 1}")
public class OtpCode {
    
    @Id
    private String id;
    
    @Indexed
    private String phone;
    
    private String code;
    
    private LocalDateTime expiresAt;
    
    private Boolean used = false;
    
    @CreatedDate
    private LocalDateTime createdAt;

    public OtpCode() {
        this.createdAt = LocalDateTime.now();
    }

    public OtpCode(String phone, String code, LocalDateTime expiresAt) {
        this.phone = phone;
        this.code = code;
        this.expiresAt = expiresAt;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
