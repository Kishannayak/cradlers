package com.cradlers.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration to enable scheduled tasks (for OTP cleanup)
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}

