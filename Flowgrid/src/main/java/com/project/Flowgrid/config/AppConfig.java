package com.project.Flowgrid.config;

import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.InteractionRepository;
import com.project.Flowgrid.repository.TaskRepository;
import com.project.Flowgrid.repository.UserRepository;
import com.project.Flowgrid.service.AnalyticsService;
import com.project.Flowgrid.service.impl.AnalyticsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public AnalyticsService analyticsService(
            CustomerRepository customerRepository,
            DealRepository dealRepository,
            InteractionRepository interactionRepository,
            UserRepository userRepository) {
        return new AnalyticsServiceImpl(
                customerRepository,
                dealRepository,
                interactionRepository,
                userRepository);
    }
} 