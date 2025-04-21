package com.project.Flowgrid.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration class that enables scheduling for the application.
 * Allows the use of @Scheduled annotation in services.
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
} 
