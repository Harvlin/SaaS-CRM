package com.project.Flowgrid.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStageMetricDTO {
    
    private Long stageId;
    private String stageName;
    private Long dealCount;
    private BigDecimal totalValue;
    private BigDecimal averageValue;
    private Double probability;
    private Double conversionRate;
    private Double avgTimeInStage;
    private BigDecimal weightedValue;
} 
