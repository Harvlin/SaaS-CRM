package com.project.Flowgrid.controller;

import com.project.Flowgrid.domain.DealStatus;
import com.project.Flowgrid.dto.DealDTO;
import com.project.Flowgrid.service.DealService;
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
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ResponseEntity<Page<DealDTO>> getAllDeals(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<DealDTO> deals = dealService.getAllDeals(pageable);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealDTO> getDealById(@PathVariable Long id) {
        DealDTO deal = dealService.getDealById(id);
        return ResponseEntity.ok(deal);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<DealDTO>> getDealsByCustomerId(
            @PathVariable Long customerId) {
        List<DealDTO> deals = dealService.getDealsByCustomerId(customerId);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DealDTO>> getDealsByStatus(
            @PathVariable DealStatus status) {
        List<DealDTO> deals = dealService.getDealsByStatus(status);
        return ResponseEntity.ok(deals);
    }

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<List<DealDTO>> getDealsByStageId(
            @PathVariable Long stageId) {
        List<DealDTO> deals = dealService.getDealsByStageId(stageId);
        return ResponseEntity.ok(deals);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<DealDTO> createDeal(@Valid @RequestBody DealDTO dealDTO) {
        DealDTO createdDeal = dealService.createDeal(dealDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDeal);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<DealDTO> updateDeal(
            @PathVariable Long id,
            @Valid @RequestBody DealDTO dealDTO) {
        DealDTO updatedDeal = dealService.updateDeal(id, dealDTO);
        return ResponseEntity.ok(updatedDeal);
    }
    
    @PatchMapping("/{id}/stage/{stageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<DealDTO> updateDealStage(
            @PathVariable Long id,
            @PathVariable Long stageId) {
        DealDTO updatedDeal = dealService.updateDealStage(id, stageId);
        return ResponseEntity.ok(updatedDeal);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }
} 
