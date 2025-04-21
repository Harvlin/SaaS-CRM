package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.InteractionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionDTO {
    
    private Long id;
    
    @NotNull(message = "Interaction type is required")
    private InteractionType type;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    private String content;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    private String customerName;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String userName;
    
    private Long dealId;
    
    private String dealTitle;
    
    @NotNull(message = "Interaction date is required")
    private LocalDateTime interactionDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
} 
