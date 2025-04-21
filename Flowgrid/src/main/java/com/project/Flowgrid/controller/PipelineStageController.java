package com.project.Flowgrid.controller;

import com.project.Flowgrid.domain.PipelineStage;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.PipelineStageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pipeline-stages")
@RequiredArgsConstructor
public class PipelineStageController {
    
    private final PipelineStageRepository pipelineStageRepository;
    
    @GetMapping
    public ResponseEntity<List<PipelineStage>> getAllStages() {
        List<PipelineStage> stages = pipelineStageRepository.findAllByOrderByDisplayOrderAsc();
        return ResponseEntity.ok(stages);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PipelineStage> getStageById(@PathVariable Long id) {
        PipelineStage stage = pipelineStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + id));
        return ResponseEntity.ok(stage);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PipelineStage> createStage(@Valid @RequestBody PipelineStage stage) {
        // Check if name already exists
        if (pipelineStageRepository.existsByName(stage.getName())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Set display order if not provided
        if (stage.getDisplayOrder() == null) {
            Long maxOrder = pipelineStageRepository.count();
            stage.setDisplayOrder(maxOrder.intValue() + 1);
        }
        
        PipelineStage savedStage = pipelineStageRepository.save(stage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStage);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PipelineStage> updateStage(@PathVariable Long id, @Valid @RequestBody PipelineStage stage) {
        PipelineStage existingStage = pipelineStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + id));
        
        // Check if name already exists for another stage
        if (!existingStage.getName().equals(stage.getName()) && 
                pipelineStageRepository.existsByName(stage.getName())) {
            return ResponseEntity.badRequest().build();
        }
        
        existingStage.setName(stage.getName());
        existingStage.setDisplayOrder(stage.getDisplayOrder());
        existingStage.setProbability(stage.getProbability());
        
        PipelineStage updatedStage = pipelineStageRepository.save(existingStage);
        return ResponseEntity.ok(updatedStage);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        if (!pipelineStageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pipeline stage not found with id: " + id);
        }
        pipelineStageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/reorder")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PipelineStage>> reorderStages(@RequestBody List<Long> stageIds) {
        List<PipelineStage> stages = pipelineStageRepository.findAllById(stageIds);
        
        if (stages.size() != stageIds.size()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Update display order based on position in the list
        for (int i = 0; i < stageIds.size(); i++) {
            Long stageId = stageIds.get(i);
            PipelineStage stage = stages.stream()
                    .filter(s -> s.getId().equals(stageId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + stageId));
            
            stage.setDisplayOrder(i + 1);
            pipelineStageRepository.save(stage);
        }
        
        List<PipelineStage> updatedStages = pipelineStageRepository.findAllByOrderByDisplayOrderAsc();
        return ResponseEntity.ok(updatedStages);
    }
} 
