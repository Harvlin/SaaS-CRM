package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    
    private Long id;
    
    private String title;
    
    private String description;
    
    private LocalDateTime dueDate;
    
    private TaskStatus status;
    
    private Long assignedUserId;
    
    private String assignedUserName;
    
    private Long customerId;
    
    private String customerName;
    
    private Long dealId;
    
    private String dealTitle;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
} 
