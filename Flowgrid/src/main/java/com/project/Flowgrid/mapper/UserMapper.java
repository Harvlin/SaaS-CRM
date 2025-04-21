package com.project.Flowgrid.mapper;

import com.project.Flowgrid.domain.User;
import com.project.Flowgrid.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface UserMapper {
    
    @Mapping(source = "passwordHash", target = "password", ignore = true)
    UserDTO toDTO(User user);
    
    @Mapping(source = "password", target = "passwordHash")
    User toEntity(UserDTO dto);
} 
