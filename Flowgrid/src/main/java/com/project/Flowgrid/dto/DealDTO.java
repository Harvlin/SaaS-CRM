package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.DealStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealDTO {
    
    private Long id;
    
    private String title;
    
    private BigDecimal amount;
    
    private Integer probability;
    
    private DealStatus status;
    
    private Long customerId;
    
    private String customerName;
    
    private Long stageId;
    
    private String stageName;
    
    private Long assignedUserId;
    
    private String assignedUserName;
    
    private LocalDateTime expectedCloseDate;
    
    private String notes;
    
    private Integer taskCount;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
} 
