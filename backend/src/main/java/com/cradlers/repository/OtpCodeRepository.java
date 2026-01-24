package com.cradlers.repository;

import com.cradlers.model.OtpCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends MongoRepository<OtpCode, String> {
    
    Optional<OtpCode> findByPhoneAndCodeAndUsedFalse(String phone, String code);
    
    @Query("{ 'expiresAt': { $lt: ?0 } }")
    void deleteExpiredCodes(LocalDateTime now);
    
}
