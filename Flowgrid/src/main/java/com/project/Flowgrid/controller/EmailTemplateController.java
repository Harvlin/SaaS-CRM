package com.project.Flowgrid.controller;

import com.project.Flowgrid.dto.EmailTemplateDTO;
import com.project.Flowgrid.service.EmailTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/email-templates")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class EmailTemplateController {

    private final EmailTemplateService emailTemplateService;

    @GetMapping
    public ResponseEntity<Page<EmailTemplateDTO>> getAllTemplates(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(emailTemplateService.getAllEmailTemplates(pageable));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<List<EmailTemplateDTO>> getAllActiveTemplates() {
        return ResponseEntity.ok(emailTemplateService.getAllActiveEmailTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailTemplateDTO> getTemplateById(@PathVariable Long id) {
        return ResponseEntity.ok(emailTemplateService.getEmailTemplateById(id));
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<EmailTemplateDTO> getTemplateByName(@PathVariable String name) {
        return ResponseEntity.ok(emailTemplateService.getEmailTemplateByName(name));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmailTemplateDTO>> searchTemplates(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(emailTemplateService.searchEmailTemplates(query, pageable));
    }

    @PostMapping
    public ResponseEntity<EmailTemplateDTO> createTemplate(@Valid @RequestBody EmailTemplateDTO templateDTO) {
        EmailTemplateDTO createdTemplate = emailTemplateService.createEmailTemplate(templateDTO);
        return new ResponseEntity<>(createdTemplate, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmailTemplateDTO> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody EmailTemplateDTO templateDTO) {
        return ResponseEntity.ok(emailTemplateService.updateEmailTemplate(id, templateDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        emailTemplateService.deleteEmailTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<EmailTemplateDTO> toggleTemplateStatus(@PathVariable Long id) {
        return ResponseEntity.ok(emailTemplateService.toggleEmailTemplateStatus(id));
    }
} 
