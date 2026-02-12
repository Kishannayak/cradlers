package com.cradlers.dto;

import com.cradlers.model.User;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

/**
 * Response DTO for OTP verification
 * Matches frontend OTPVerifyResponse interface
 */
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class OtpVerifyResponse {
    
    private UserDto user;
    private String token;

    public OtpVerifyResponse() {
    }

    public OtpVerifyResponse(UserDto user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    /**
     * User DTO matching frontend User interface
     */
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class UserDto {
        private String id;
        private String phone;
        private String email;
        private String role;
        private String createdAt;

        public UserDto() {
        }

        public UserDto(String id, String phone, String email, String role, String createdAt) {
            this.id = id;
            this.phone = phone;
            this.email = email;
            this.role = role; // null = customer
            this.createdAt = createdAt;
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

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}

