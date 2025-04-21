package com.project.Flowgrid.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    
    // Summary metrics
    private Long totalCustomers;
    private Long totalDeals;
    private Long totalTasks;
    private Long totalInteractions;
    
    // New customers/leads in last 30 days
    private Long newCustomers;
    
    // Deal metrics
    private Long openDeals;
    private Long wonDeals;
    private Long lostDeals;
    private BigDecimal totalDealValue;
    private BigDecimal openDealValue;
    private BigDecimal wonDealValue;
    
    // Deal stage metrics
    private List<PipelineStageMetricDTO> pipelineStageMetrics;
    
    // Tasks
    private Long overdueTasks;
    private Long tasksDueToday;
    private Long completedTasksThisWeek;
    
    // Conversion rate
    private Double leadToCustomerRate;
    private Double dealWinRate;
    
    // Time metrics (in days)
    private Double avgDealCycleTime;
    
    // Activity summary
    private Map<String, Long> interactionsByType;
    private Map<String, Long> interactionsByDay;
    
    // Sales performance
    private List<SalesPerformanceDTO> salesPerformance;
} 
