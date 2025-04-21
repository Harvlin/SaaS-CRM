package com.project.Flowgrid.service.impl;

import com.project.Flowgrid.domain.DealStatus;
import com.project.Flowgrid.domain.InteractionType;
import com.project.Flowgrid.domain.TaskStatus;
import com.project.Flowgrid.domain.User;
import com.project.Flowgrid.dto.DashboardDTO;
import com.project.Flowgrid.dto.DateRangeDTO;
import com.project.Flowgrid.dto.PipelineStageMetricDTO;
import com.project.Flowgrid.dto.SalesPerformanceDTO;
import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.InteractionRepository;
import com.project.Flowgrid.repository.UserRepository;
import com.project.Flowgrid.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final InteractionRepository interactionRepository;
    private final UserRepository userRepository;

    @Autowired
    public AnalyticsServiceImpl(
            CustomerRepository customerRepository,
            DealRepository dealRepository,
            InteractionRepository interactionRepository,
            UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.interactionRepository = interactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardDTO getDashboardMetrics() {
        // Default to last 30 days
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return getDashboardMetrics(new DateRangeDTO(startDate, endDate));
    }

    @Override
    public DashboardDTO getDashboardMetrics(DateRangeDTO dateRange) {
        // Basic implementation: count entities and return placeholder data
        long totalCustomers = customerRepository.count();
        long totalDeals = dealRepository.count();
        long totalTasks = 0; // Temporary fix - hardcoded until TaskRepository is working
        long totalInteractions = interactionRepository.count();
        
        BigDecimal zeroValue = BigDecimal.ZERO;
        
        return DashboardDTO.builder()
                .totalCustomers(totalCustomers)
                .totalDeals(totalDeals)
                .totalTasks(totalTasks)
                .totalInteractions(totalInteractions)
                .newCustomers(0L)
                .openDeals(0L)
                .wonDeals(0L)
                .lostDeals(0L)
                .totalDealValue(zeroValue)
                .openDealValue(zeroValue)
                .wonDealValue(zeroValue)
                .pipelineStageMetrics(new ArrayList<>())
                .overdueTasks(0L)
                .tasksDueToday(0L)
                .completedTasksThisWeek(0L)
                .leadToCustomerRate(0.0)
                .dealWinRate(0.0)
                .avgDealCycleTime(0.0)
                .interactionsByType(new HashMap<>())
                .interactionsByDay(new HashMap<>())
                .salesPerformance(new ArrayList<>())
                .build();
    }

    @Override
    public List<PipelineStageMetricDTO> getPipelineMetrics() {
        return new ArrayList<>();
    }

    @Override
    public List<PipelineStageMetricDTO> getPipelineMetrics(DateRangeDTO dateRange) {
        return new ArrayList<>();
    }

    @Override
    public List<SalesPerformanceDTO> getSalesPerformance() {
        return new ArrayList<>();
    }

    @Override
    public List<SalesPerformanceDTO> getSalesPerformance(DateRangeDTO dateRange) {
        return new ArrayList<>();
    }

    @Override
    public SalesPerformanceDTO getSalesPerformanceByUser(Long userId) {
        return SalesPerformanceDTO.builder()
                .userId(userId)
                .userName(getUserName(userId))
                .customerCount(0L)
                .dealCount(0L)
                .wonDealCount(0L)
                .lostDealCount(0L)
                .totalDealValue(BigDecimal.ZERO)
                .wonDealValue(BigDecimal.ZERO)
                .winRate(0.0)
                .taskCount(0L)
                .completedTaskCount(0L)
                .interactionCount(0L)
                .build();
    }

    @Override
    public SalesPerformanceDTO getSalesPerformanceByUser(Long userId, DateRangeDTO dateRange) {
        return getSalesPerformanceByUser(userId);
    }

    @Override
    public Map<LocalDate, Long> getCustomerGrowth(DateRangeDTO dateRange, String interval) {
        return new HashMap<>();
    }

    @Override
    public Map<LocalDate, Double> getDealValueTrend(DateRangeDTO dateRange, String interval) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Long> getInteractionsByType(DateRangeDTO dateRange) {
        Map<String, Long> result = new HashMap<>();
        
        // Initialize with all interaction types
        for (InteractionType type : InteractionType.values()) {
            result.put(type.name(), 0L);
        }
        
        return result;
    }

    @Override
    public Map<String, Double> generateSalesForecast(int months) {
        Map<String, Double> forecast = new HashMap<>();
        
        // Generate placeholder forecast for requested number of months
        LocalDate now = LocalDate.now();
        
        for (int i = 1; i <= months; i++) {
            LocalDate forecastMonth = now.plusMonths(i);
            String monthKey = forecastMonth.getYear() + "-" + String.format("%02d", forecastMonth.getMonthValue());
            forecast.put(monthKey, 0.0);
        }
        
        return forecast;
    }
    
    private String getUserName(Long userId) {
        return userRepository.findById(userId)
                .map(User::getUsername)
                .orElse("Unknown User");
    }
} 
