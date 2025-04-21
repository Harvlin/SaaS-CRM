package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.EmailTemplate;
import com.project.Flowgrid.dto.EmailTemplateDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.EmailTemplateRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    @Transactional(readOnly = true)
    public Page<EmailTemplateDTO> getAllEmailTemplates(Pageable pageable) {
        return emailTemplateRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<EmailTemplateDTO> getAllActiveEmailTemplates() {
        return emailTemplateRepository.findByActive(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmailTemplateDTO getEmailTemplateById(Long id) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Email template not found with ID: " + id));
        return convertToDTO(template);
    }

    @Transactional(readOnly = true)
    public EmailTemplateDTO getEmailTemplateByName(String name) {
        EmailTemplate template = emailTemplateRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Email template not found with name: " + name));
        return convertToDTO(template);
    }

    @Transactional(readOnly = true)
    public Page<EmailTemplateDTO> searchEmailTemplates(String query, Pageable pageable) {
        return emailTemplateRepository.findByNameContainingIgnoreCase(query, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public EmailTemplateDTO createEmailTemplate(@Valid EmailTemplateDTO emailTemplateDTO) {
        if (emailTemplateRepository.existsByName(emailTemplateDTO.getName())) {
            throw new IllegalArgumentException("Email template with name '" + emailTemplateDTO.getName() + "' already exists");
        }
        
        EmailTemplate template = convertToEntity(emailTemplateDTO);
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        
        EmailTemplate savedTemplate = emailTemplateRepository.save(template);
        return convertToDTO(savedTemplate);
    }

    @Transactional
    public EmailTemplateDTO updateEmailTemplate(Long id, EmailTemplateDTO emailTemplateDTO) {
        EmailTemplate existingTemplate = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Email template not found with ID: " + id));

        // Check if the name is being changed and already exists
        if (!existingTemplate.getName().equals(emailTemplateDTO.getName()) &&
                emailTemplateRepository.existsByName(emailTemplateDTO.getName())) {
            throw new IllegalArgumentException("Email template with name '" + emailTemplateDTO.getName() + "' already exists");
        }

        existingTemplate.setName(emailTemplateDTO.getName());
        existingTemplate.setSubject(emailTemplateDTO.getSubject());
        existingTemplate.setContent(emailTemplateDTO.getContent());
        existingTemplate.setActive(emailTemplateDTO.getActive());
        existingTemplate.setUpdatedAt(LocalDateTime.now());
        
        EmailTemplate updatedTemplate = emailTemplateRepository.save(existingTemplate);
        return convertToDTO(updatedTemplate);
    }

    @Transactional
    public void deleteEmailTemplate(Long id) {
        if (!emailTemplateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Email template not found with ID: " + id);
        }
        emailTemplateRepository.deleteById(id);
    }

    @Transactional
    public EmailTemplateDTO toggleEmailTemplateStatus(Long id) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Email template not found with ID: " + id));
        
        template.setActive(!template.isActive());
        template.setUpdatedAt(LocalDateTime.now());
        
        EmailTemplate updatedTemplate = emailTemplateRepository.save(template);
        return convertToDTO(updatedTemplate);
    }

    private EmailTemplateDTO convertToDTO(EmailTemplate template) {
        return EmailTemplateDTO.builder()
                .id(template.getId())
                .name(template.getName())
                .subject(template.getSubject())
                .content(template.getContent())
                .active(template.isActive())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }

    private EmailTemplate convertToEntity(EmailTemplateDTO dto) {
        EmailTemplate.EmailTemplateBuilder builder = EmailTemplate.builder()
                .name(dto.getName())
                .subject(dto.getSubject())
                .content(dto.getContent())
                .active(dto.getActive());

        if (dto.getId() != null) {
            builder.id(dto.getId());
        }
        
        if (dto.getCreatedAt() != null) {
            builder.createdAt(dto.getCreatedAt());
        }
        
        if (dto.getUpdatedAt() != null) {
            builder.updatedAt(dto.getUpdatedAt());
        }
        
        return builder.build();
    }
} 
