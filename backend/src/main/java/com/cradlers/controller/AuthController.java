package com.cradlers.controller;

import com.cradlers.dto.OtpLoginRequest;
import com.cradlers.dto.OtpVerifyRequest;
import com.cradlers.dto.OtpVerifyResponse;
import com.cradlers.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/otp
     * Request OTP code for phone number
     */
    @PostMapping("/otp")
    public ResponseEntity<Map<String, String>> requestOtp(@Valid @RequestBody OtpLoginRequest request) {
        try {
            logger.info("OTP request received for phone: {}", request.getPhone());
            String otp = authService.requestOtp(request);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent successfully");
            response.put("otp", otp);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error requesting OTP", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send OTP");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * POST /api/auth/otp/verify
     * Verify OTP code and return user with JWT token
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        try {
            logger.info("OTP verification request for phone: {}", request.getPhone());
            OtpVerifyResponse response = authService.verifyOtp(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("OTP verification failed", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Error verifying OTP", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to verify OTP");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

