package com.project.Flowgrid.controller;

import com.project.Flowgrid.domain.InteractionType;
import com.project.Flowgrid.dto.InteractionDTO;
import com.project.Flowgrid.service.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Page<InteractionDTO>> getAllInteractions(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(interactionService.getAllInteractions(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<InteractionDTO> getInteractionById(@PathVariable Long id) {
        return ResponseEntity.ok(interactionService.getInteractionById(id));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Page<InteractionDTO>> getInteractionsByCustomerId(
            @PathVariable Long customerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(interactionService.getInteractionsByCustomerId(customerId, pageable));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<InteractionDTO>> getInteractionsByUserId(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(interactionService.getInteractionsByUserId(userId, pageable));
    }

    @GetMapping("/deal/{dealId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Page<InteractionDTO>> getInteractionsByDealId(
            @PathVariable Long dealId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(interactionService.getInteractionsByDealId(dealId, pageable));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<InteractionDTO>> getInteractionsByType(
            @PathVariable InteractionType type,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(interactionService.getInteractionsByType(type, pageable));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<InteractionDTO>> getInteractionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(interactionService.getInteractionsByDateRange(start, end));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<InteractionDTO> createInteraction(@Valid @RequestBody InteractionDTO interactionDTO) {
        InteractionDTO createdInteraction = interactionService.createInteraction(interactionDTO);
        return new ResponseEntity<>(createdInteraction, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<InteractionDTO> updateInteraction(
            @PathVariable Long id,
            @Valid @RequestBody InteractionDTO interactionDTO) {
        return ResponseEntity.ok(interactionService.updateInteraction(id, interactionDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteInteraction(@PathVariable Long id) {
        interactionService.deleteInteraction(id);
        return ResponseEntity.noContent().build();
    }
} 
