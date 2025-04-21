package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.EmailTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    
    Optional<EmailTemplate> findByName(String name);
    
    boolean existsByName(String name);
    
    List<EmailTemplate> findByActive(boolean active);
    
    Page<EmailTemplate> findByActive(boolean active, Pageable pageable);
    
    List<EmailTemplate> findByNameContainingIgnoreCase(String name);
    
    Page<EmailTemplate> findByNameContainingIgnoreCase(String name, Pageable pageable);
} 
