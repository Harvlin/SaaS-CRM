package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.PipelineStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PipelineStageRepository extends JpaRepository<PipelineStage, Long> {

    List<PipelineStage> findAllByOrderByDisplayOrderAsc();
    
    PipelineStage findByName(String name);
    
    boolean existsByName(String name);
} 
