package com.project.Flowgrid.service;

import com.project.Flowgrid.dto.DashboardDTO;
import com.project.Flowgrid.dto.DateRangeDTO;
import com.project.Flowgrid.dto.PipelineStageMetricDTO;
import com.project.Flowgrid.dto.SalesPerformanceDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    
    /**
     * Get dashboard metrics for the current user
     * @return Dashboard metrics
     */
    DashboardDTO getDashboardMetrics();
    
    /**
     * Get dashboard metrics for a specific date range
     * @param dateRange The date range to filter by
     * @return Dashboard metrics
     */
    DashboardDTO getDashboardMetrics(DateRangeDTO dateRange);
    
    /**
     * Get pipeline stage metrics
     * @return List of metrics by pipeline stage
     */
    List<PipelineStageMetricDTO> getPipelineMetrics();
    
    /**
     * Get pipeline stage metrics for a specific date range
     * @param dateRange The date range to filter by
     * @return List of metrics by pipeline stage
     */
    List<PipelineStageMetricDTO> getPipelineMetrics(DateRangeDTO dateRange);
    
    /**
     * Get sales performance metrics for all users
     * @return List of sales performance metrics by user
     */
    List<SalesPerformanceDTO> getSalesPerformance();
    
    /**
     * Get sales performance metrics for all users in a specific date range
     * @param dateRange The date range to filter by
     * @return List of sales performance metrics by user
     */
    List<SalesPerformanceDTO> getSalesPerformance(DateRangeDTO dateRange);
    
    /**
     * Get sales performance metrics for a specific user
     * @param userId The user ID
     * @return Sales performance metrics for the user
     */
    SalesPerformanceDTO getSalesPerformanceByUser(Long userId);
    
    /**
     * Get sales performance metrics for a specific user in a date range
     * @param userId The user ID
     * @param dateRange The date range to filter by
     * @return Sales performance metrics for the user
     */
    SalesPerformanceDTO getSalesPerformanceByUser(Long userId, DateRangeDTO dateRange);
    
    /**
     * Get customer growth over time
     * @param dateRange The date range to analyze
     * @param interval The interval (day, week, month)
     * @return Map of date to customer count
     */
    Map<LocalDate, Long> getCustomerGrowth(DateRangeDTO dateRange, String interval);
    
    /**
     * Get deal value by time period
     * @param dateRange The date range to analyze
     * @param interval The interval (day, week, month)
     * @return Map of date to deal value
     */
    Map<LocalDate, Double> getDealValueTrend(DateRangeDTO dateRange, String interval);
    
    /**
     * Get interaction count by type
     * @param dateRange The date range to filter by
     * @return Map of interaction type to count
     */
    Map<String, Long> getInteractionsByType(DateRangeDTO dateRange);
    
    /**
     * Generate a sales forecast based on pipeline and historical data
     * @param months Number of months to forecast
     * @return Map of month to forecasted sales value
     */
    Map<String, Double> generateSalesForecast(int months);
} 
