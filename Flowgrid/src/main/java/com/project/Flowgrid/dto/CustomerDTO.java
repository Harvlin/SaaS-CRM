package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.CustomerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    
    private Long id;
    
    private String firstName;
    
    private String lastName;
    
    private String email;
    
    private String phoneNumber;
    
    private String company;
    
    private String notes;
    
    private CustomerStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Integer dealCount;
    
    private Integer taskCount;
    
    private Integer interactionCount;
} 
