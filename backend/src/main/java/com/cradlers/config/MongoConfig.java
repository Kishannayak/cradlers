package com.cradlers.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * MongoDB configuration
 * Enables automatic timestamping for @CreatedDate annotations
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
}

