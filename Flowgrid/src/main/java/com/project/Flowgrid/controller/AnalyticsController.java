package com.project.Flowgrid.controller;

import com.project.Flowgrid.dto.DashboardDTO;
import com.project.Flowgrid.dto.DateRangeDTO;
import com.project.Flowgrid.dto.PipelineStageMetricDTO;
import com.project.Flowgrid.dto.SalesPerformanceDTO;
import com.project.Flowgrid.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDTO> getDashboardMetrics() {
        return ResponseEntity.ok(analyticsService.getDashboardMetrics());
    }
    
    @PostMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DashboardDTO> getDashboardMetrics(@RequestBody @Valid DateRangeDTO dateRange) {
        return ResponseEntity.ok(analyticsService.getDashboardMetrics(dateRange));
    }
    
    @GetMapping("/pipeline")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PipelineStageMetricDTO>> getPipelineMetrics() {
        return ResponseEntity.ok(analyticsService.getPipelineMetrics());
    }
    
    @PostMapping("/pipeline")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PipelineStageMetricDTO>> getPipelineMetrics(@RequestBody @Valid DateRangeDTO dateRange) {
        return ResponseEntity.ok(analyticsService.getPipelineMetrics(dateRange));
    }
    
    @GetMapping("/sales-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<SalesPerformanceDTO>> getSalesPerformance() {
        return ResponseEntity.ok(analyticsService.getSalesPerformance());
    }
    
    @PostMapping("/sales-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<SalesPerformanceDTO>> getSalesPerformance(@RequestBody @Valid DateRangeDTO dateRange) {
        return ResponseEntity.ok(analyticsService.getSalesPerformance(dateRange));
    }
    
    @GetMapping("/sales-performance/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<SalesPerformanceDTO> getSalesPerformanceByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getSalesPerformanceByUser(userId));
    }
    
    @PostMapping("/sales-performance/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<SalesPerformanceDTO> getSalesPerformanceByUser(
            @PathVariable Long userId,
            @RequestBody @Valid DateRangeDTO dateRange) {
        return ResponseEntity.ok(analyticsService.getSalesPerformanceByUser(userId, dateRange));
    }
    
    @GetMapping("/customer-growth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<LocalDate, Long>> getCustomerGrowth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "day") String interval) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        return ResponseEntity.ok(analyticsService.getCustomerGrowth(dateRange, interval));
    }
    
    @GetMapping("/deal-value-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<LocalDate, Double>> getDealValueTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "day") String interval) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        return ResponseEntity.ok(analyticsService.getDealValueTrend(dateRange, interval));
    }
    
    @GetMapping("/interactions-by-type")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Long>> getInteractionsByType(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        return ResponseEntity.ok(analyticsService.getInteractionsByType(dateRange));
    }
    
    @GetMapping("/sales-forecast")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Double>> generateSalesForecast(
            @RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(analyticsService.generateSalesForecast(months));
    }
    
    // Data export endpoints
    
    @GetMapping("/export/pipeline-metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> exportPipelineMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        List<PipelineStageMetricDTO> metrics = analyticsService.getPipelineMetrics(dateRange);
        
        // Convert to CSV
        StringBuilder csv = new StringBuilder();
        csv.append("Stage ID,Stage Name,Deal Count,Total Value,Probability,Weighted Value\n");
        
        for (PipelineStageMetricDTO metric : metrics) {
            csv.append(metric.getStageId()).append(",")
               .append(metric.getStageName()).append(",")
               .append(metric.getDealCount()).append(",")
               .append(metric.getTotalValue()).append(",")
               .append(metric.getProbability()).append(",")
               .append(metric.getWeightedValue()).append("\n");
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "pipeline-metrics.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
    
    @GetMapping("/export/sales-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> exportSalesPerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        List<SalesPerformanceDTO> performances = analyticsService.getSalesPerformance(dateRange);
        
        // Convert to CSV
        StringBuilder csv = new StringBuilder();
        csv.append("User ID,User Name,Customer Count,Deal Count,Won Deals,Lost Deals,")
           .append("Total Deal Value,Won Deal Value,Win Rate,Task Count,Completed Tasks,Interaction Count\n");
        
        for (SalesPerformanceDTO performance : performances) {
            csv.append(performance.getUserId()).append(",")
               .append(performance.getUserName()).append(",")
               .append(performance.getCustomerCount()).append(",")
               .append(performance.getDealCount()).append(",")
               .append(performance.getWonDealCount()).append(",")
               .append(performance.getLostDealCount()).append(",")
               .append(performance.getTotalDealValue()).append(",")
               .append(performance.getWonDealValue()).append(",")
               .append(performance.getWinRate()).append(",")
               .append(performance.getTaskCount()).append(",")
               .append(performance.getCompletedTaskCount()).append(",")
               .append(performance.getInteractionCount()).append("\n");
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "sales-performance.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
    
    @GetMapping("/export/customer-growth")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> exportCustomerGrowth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "day") String interval) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        Map<LocalDate, Long> data = analyticsService.getCustomerGrowth(dateRange, interval);
        
        // Convert to CSV
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Customer Count\n");
        
        data.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> 
                csv.append(entry.getKey()).append(",")
                   .append(entry.getValue()).append("\n")
            );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "customer-growth.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
    
    @GetMapping("/export/deal-value-trend")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> exportDealValueTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "day") String interval) {
        DateRangeDTO dateRange = new DateRangeDTO(startDate, endDate);
        Map<LocalDate, Double> data = analyticsService.getDealValueTrend(dateRange, interval);
        
        // Convert to CSV
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Deal Value\n");
        
        data.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> 
                csv.append(entry.getKey()).append(",")
                   .append(entry.getValue()).append("\n")
            );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "deal-value-trend.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
    
    @GetMapping("/export/sales-forecast")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> exportSalesForecast(
            @RequestParam(defaultValue = "6") int months) {
        Map<String, Double> data = analyticsService.generateSalesForecast(months);
        
        // Convert to CSV
        StringBuilder csv = new StringBuilder();
        csv.append("Month,Forecasted Value\n");
        
        data.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> 
                csv.append(entry.getKey()).append(",")
                   .append(entry.getValue()).append("\n")
            );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "sales-forecast.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
} 
