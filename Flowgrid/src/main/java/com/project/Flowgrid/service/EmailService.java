package com.project.Flowgrid.service;

import com.project.Flowgrid.dto.EmailMessageDTO;
import com.project.Flowgrid.dto.ScheduledEmailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface EmailService {
    
    /**
     * Send an email immediately
     * @param emailMessageDTO The email to send
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendEmail(EmailMessageDTO emailMessageDTO);
    
    /**
     * Schedule an email to be sent at a later time
     * @param emailMessageDTO The email to schedule
     * @return The scheduled email DTO
     */
    ScheduledEmailDTO scheduleEmail(EmailMessageDTO emailMessageDTO);
    
    /**
     * Get all scheduled emails
     * @param pageable Pagination information
     * @return A page of scheduled emails
     */
    Page<ScheduledEmailDTO> getAllScheduledEmails(Pageable pageable);
    
    /**
     * Get a scheduled email by ID
     * @param id The ID of the scheduled email
     * @return The scheduled email DTO
     */
    ScheduledEmailDTO getScheduledEmailById(Long id);
    
    /**
     * Get scheduled emails for a customer
     * @param customerId The customer ID
     * @param pageable Pagination information
     * @return A page of scheduled emails
     */
    Page<ScheduledEmailDTO> getScheduledEmailsByCustomerId(Long customerId, Pageable pageable);
    
    /**
     * Get scheduled emails for a deal
     * @param dealId The deal ID
     * @param pageable Pagination information
     * @return A page of scheduled emails
     */
    Page<ScheduledEmailDTO> getScheduledEmailsByDealId(Long dealId, Pageable pageable);
    
    /**
     * Cancel a scheduled email
     * @param id The ID of the scheduled email
     * @return The updated scheduled email DTO
     */
    ScheduledEmailDTO cancelScheduledEmail(Long id);
    
    /**
     * Process emails that are due to be sent
     */
    void processScheduledEmails();
    
    /**
     * Apply template variables to a template content
     * @param templateContent The template content
     * @param variables The variables to apply
     * @return The processed content
     */
    String processTemplate(String templateContent, Map<String, String> variables);
} 
