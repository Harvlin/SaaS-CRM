package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.EmailStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledEmailDTO {
    
    private Long id;
    
    @NotBlank(message = "From email is required")
    @Email(message = "From email must be valid")
    private String fromEmail;
    
    @NotNull(message = "To emails are required")
    private List<@Email(message = "Each to email must be valid") String> toEmails;
    
    private List<@Email(message = "Each cc email must be valid") String> ccEmails;
    
    private List<@Email(message = "Each bcc email must be valid") String> bccEmails;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private Long templateId;
    
    private String templateName;
    
    private Map<String, String> templateVariables;
    
    private Long customerId;
    
    private String customerName;
    
    private Long dealId;
    
    private String dealTitle;
    
    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledTime;
    
    private EmailStatus status;
    
    private LocalDateTime sentTime;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
} 
