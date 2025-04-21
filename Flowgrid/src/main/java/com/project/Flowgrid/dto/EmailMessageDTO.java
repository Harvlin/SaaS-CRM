package com.project.Flowgrid.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class EmailMessageDTO {
    
    @NotBlank(message = "From address is required")
    @Email(message = "From address must be a valid email")
    private String from;
    
    @NotEmpty(message = "At least one recipient is required")
    private List<@Email(message = "Each recipient must be a valid email") String> to;
    
    private List<@Email(message = "Each CC recipient must be a valid email") String> cc;
    
    private List<@Email(message = "Each BCC recipient must be a valid email") String> bcc;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "Email content is required")
    private String content;
    
    private Long templateId;
    
    private Map<String, String> templateVariables;
    
    private Long customerId;
    
    private Long dealId;
    
    private LocalDateTime scheduledTime;
} 
