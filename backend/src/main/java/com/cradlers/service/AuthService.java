package com.cradlers.service;

import com.cradlers.dto.OtpLoginRequest;
import com.cradlers.dto.OtpVerifyRequest;
import com.cradlers.dto.OtpVerifyResponse;
import com.cradlers.model.OtpCode;
import com.cradlers.model.User;
import com.cradlers.repository.OtpCodeRepository;
import com.cradlers.repository.UserRepository;
import com.cradlers.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * Service for handling authentication operations
 */
@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private final Random random = new Random();
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OtpCodeRepository otpCodeRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.bootstrap-admin-phones:}")
    private String bootstrapAdminPhones;

    @Value("${app.bootstrap-vendor-phones:}")
    private String bootstrapVendorPhones;

    @Value("${app.bootstrap-doctor-phones:}")
    private String bootstrapDoctorPhones;

    /**
     * Request OTP for phone number
     * In production, this would send SMS via a service like Twilio
     */
    public void requestOtp(OtpLoginRequest request) {
        String phone = request.getPhone();
        logger.info("Requesting OTP for phone: {}", phone);
        
        // Generate 6-digit OTP
        String otp = generateOtp();
        
        // Calculate expiry time (10 minutes from now)
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        
        // Save OTP to database
        OtpCode otpCode = new OtpCode(phone, otp, expiresAt);
        otpCodeRepository.save(otpCode);
        
        // In production, send SMS here
        // For now, we'll just log it
        logger.info("OTP generated for {}: {} (expires at {})", phone, otp, expiresAt);
        
        // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
        // smsService.sendOtp(phone, otp);
    }

    /**
     * Verify OTP and return user with JWT token
     */
    public OtpVerifyResponse verifyOtp(OtpVerifyRequest request) {
        String phone = request.getPhone();
        String otp = request.getOtp();
        
        logger.info("Verifying OTP for phone: {}", phone);
        
        // Find valid OTP code
        OtpCode otpCode = otpCodeRepository
                .findByPhoneAndCodeAndUsedFalse(phone, otp)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));
        
        // Check if OTP is expired
        if (otpCode.isExpired()) {
            throw new RuntimeException("OTP has expired");
        }
        
        // Mark OTP as used
        otpCode.setUsed(true);
        otpCodeRepository.save(otpCode);
        
        // Resolve role from request: only ADMIN or VENDOR stored; no role = customer
        String requestedRole = request.getRole();
        String role = normalizeRole(requestedRole);
        
        // Find or create user
        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> {
                    User newUser = new User(phone, role);
                    return userRepository.save(newUser);
                });
        // Bootstrap admin: if phone is in config list, always set ADMIN
        if (isBootstrapPhone(phone, bootstrapAdminPhones)) {
            user.setRole("ADMIN");
            userRepository.save(user);
        } else if (isBootstrapPhone(phone, bootstrapVendorPhones)) {
            user.setRole("VENDOR");
            userRepository.save(user);
        } else if (isBootstrapPhone(phone, bootstrapDoctorPhones)) {
            user.setRole("DOCTOR");
            userRepository.save(user);
        }
        // Otherwise existing users keep their existing role

        // Generate JWT token (include role)
        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getRole());
        
        // Build response
        OtpVerifyResponse.UserDto userDto = new OtpVerifyResponse.UserDto(
                user.getId(),
                user.getPhone(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
        );
        
        logger.info("OTP verified successfully for user: {}", user.getId());
        
        return new OtpVerifyResponse(userDto, token);
    }

    /**
     * Check if phone is in the given bootstrap list (comparison ignores spaces).
     */
    private boolean isBootstrapPhone(String phone, String configList) {
        if (configList == null || configList.isBlank()) return false;
        String normalized = normalizePhone(phone);
        List<String> phones = Arrays.stream(configList.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(this::normalizePhone)
                .collect(Collectors.toList());
        return phones.contains(normalized);
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        return phone.replaceAll("\\s+", "").trim();
    }

    /**
     * Normalize role from request: admin -> ADMIN, vendor -> VENDOR, doctor -> DOCTOR. Else null (customer).
     */
    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return null;
        String r = role.trim().toUpperCase();
        if ("ADMIN".equals(r)) return "ADMIN";
        if ("VENDOR".equals(r)) return "VENDOR";
        if ("DOCTOR".equals(r)) return "DOCTOR";
        return null;
    }

    /**
     * Generate a random 6-digit OTP
     */
    private String generateOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Clean up expired OTP codes (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void cleanupExpiredOtpCodes() {
        logger.debug("Cleaning up expired OTP codes");
        try {
            otpCodeRepository.deleteExpiredCodes(LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Error cleaning up expired OTP codes", e);
        }
    }
}

