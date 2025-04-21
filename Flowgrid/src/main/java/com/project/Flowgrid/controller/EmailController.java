package com.project.Flowgrid.controller;

import com.project.Flowgrid.dto.EmailMessageDTO;
import com.project.Flowgrid.dto.ScheduledEmailDTO;
import com.project.Flowgrid.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Boolean> sendEmail(@Valid @RequestBody EmailMessageDTO emailMessageDTO) {
        boolean result = emailService.sendEmail(emailMessageDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<ScheduledEmailDTO> scheduleEmail(@Valid @RequestBody EmailMessageDTO emailMessageDTO) {
        ScheduledEmailDTO scheduledEmail = emailService.scheduleEmail(emailMessageDTO);
        return new ResponseEntity<>(scheduledEmail, HttpStatus.CREATED);
    }

    @GetMapping("/scheduled")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<ScheduledEmailDTO>> getAllScheduledEmails(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(emailService.getAllScheduledEmails(pageable));
    }

    @GetMapping("/scheduled/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<ScheduledEmailDTO> getScheduledEmailById(@PathVariable Long id) {
        return ResponseEntity.ok(emailService.getScheduledEmailById(id));
    }

    @GetMapping("/scheduled/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Page<ScheduledEmailDTO>> getScheduledEmailsByCustomerId(
            @PathVariable Long customerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(emailService.getScheduledEmailsByCustomerId(customerId, pageable));
    }

    @GetMapping("/scheduled/deal/{dealId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Page<ScheduledEmailDTO>> getScheduledEmailsByDealId(
            @PathVariable Long dealId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(emailService.getScheduledEmailsByDealId(dealId, pageable));
    }

    @DeleteMapping("/scheduled/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<ScheduledEmailDTO> cancelScheduledEmail(@PathVariable Long id) {
        return ResponseEntity.ok(emailService.cancelScheduledEmail(id));
    }
} 
