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
public class SalesPerformanceDTO {
    
    private Long userId;
    private String userName;
    
    private Long customerCount;
    private Long dealCount;
    private Long wonDealCount;
    private Long lostDealCount;
    
    private BigDecimal totalDealValue;
    private BigDecimal wonDealValue;
    private Double winRate;
    
    private Long taskCount;
    private Long completedTaskCount;
    
    private Long interactionCount;
} 
