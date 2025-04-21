package com.project.Flowgrid.dto;

import com.project.Flowgrid.domain.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    // Password is only required for creation, not for updates
    private String password;
    
    @NotNull(message = "Role is required")
    private UserRole role;
    
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
