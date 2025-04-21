package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.DealStatus;
import com.project.Flowgrid.domain.PipelineStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByCustomer(Customer customer);
    
    Page<Deal> findByCustomer(Customer customer, Pageable pageable);
    
    List<Deal> findByStatus(DealStatus status);
    
    Page<Deal> findByStatus(DealStatus status, Pageable pageable);
    
    List<Deal> findByStage(PipelineStage stage);
    
    Page<Deal> findByStage(PipelineStage stage, Pageable pageable);
    
    List<Deal> findByAssignedUserId(Long userId);
    
    Page<Deal> findByAssignedUserId(Long userId, Pageable pageable);
    
    Long countByStageId(Long stageId);
    
    @Query("SELECT SUM(d.amount) FROM Deal d WHERE d.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") DealStatus status);
    
    // Analytics queries
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.createdAt BETWEEN :startDate AND :endDate")
    Long countDealsCreatedBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.status = :status AND d.updatedAt BETWEEN :startDate AND :endDate")
    Long countDealsByStatusBetween(
            @Param("status") DealStatus status, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT d.stage.id, d.stage.name, COUNT(d), SUM(d.amount), AVG(d.probability) " +
           "FROM Deal d WHERE d.status = 'OPEN' GROUP BY d.stage.id, d.stage.name")
    List<Object[]> getPipelineStageMetrics();
    
    @Query("SELECT d.stage.id, d.stage.name, COUNT(d), SUM(d.amount), AVG(d.probability) " +
           "FROM Deal d WHERE d.status = 'OPEN' AND d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY d.stage.id, d.stage.name")
    List<Object[]> getPipelineStageMetricsBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT d.assignedUser.id, COUNT(d), SUM(CASE WHEN d.status = 'WON' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN d.status = 'LOST' THEN 1 ELSE 0 END), SUM(d.amount), " +
           "SUM(CASE WHEN d.status = 'WON' THEN d.amount ELSE 0 END) " +
           "FROM Deal d WHERE d.assignedUser IS NOT NULL GROUP BY d.assignedUser.id")
    List<Object[]> getSalesPerformanceByUser();
    
    @Query("SELECT d.assignedUser.id, COUNT(d), SUM(CASE WHEN d.status = 'WON' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN d.status = 'LOST' THEN 1 ELSE 0 END), SUM(d.amount), " +
           "SUM(CASE WHEN d.status = 'WON' THEN d.amount ELSE 0 END) " +
           "FROM Deal d WHERE d.assignedUser IS NOT NULL AND d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY d.assignedUser.id")
    List<Object[]> getSalesPerformanceByUserBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT d.assignedUser.id, COUNT(d), SUM(CASE WHEN d.status = 'WON' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN d.status = 'LOST' THEN 1 ELSE 0 END), SUM(d.amount), " +
           "SUM(CASE WHEN d.status = 'WON' THEN d.amount ELSE 0 END) " +
           "FROM Deal d WHERE d.assignedUser.id = :userId " +
           "GROUP BY d.assignedUser.id")
    Object[] getSalesPerformanceForUser(@Param("userId") Long userId);
    
    @Query("SELECT d.assignedUser.id, COUNT(d), SUM(CASE WHEN d.status = 'WON' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN d.status = 'LOST' THEN 1 ELSE 0 END), SUM(d.amount), " +
           "SUM(CASE WHEN d.status = 'WON' THEN d.amount ELSE 0 END) " +
           "FROM Deal d WHERE d.assignedUser.id = :userId AND d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY d.assignedUser.id")
    Object[] getSalesPerformanceForUserBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT CAST(d.createdAt AS LocalDate) as date, COUNT(d) " +
           "FROM Deal d WHERE d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(d.createdAt AS LocalDate) ORDER BY date")
    List<Object[]> getDealCountByDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT YEAR(d.createdAt) as year, MONTH(d.createdAt) as month, COUNT(d) " +
           "FROM Deal d WHERE d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(d.createdAt), MONTH(d.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> getDealCountByMonth(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT CAST(d.createdAt AS LocalDate) as date, SUM(d.amount) " +
           "FROM Deal d WHERE d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(d.createdAt AS LocalDate) ORDER BY date")
    List<Object[]> getDealValueByDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT YEAR(d.createdAt) as year, MONTH(d.createdAt) as month, SUM(d.amount) " +
           "FROM Deal d WHERE d.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(d.createdAt), MONTH(d.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> getDealValueByMonth(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(DAY, d.createdAt, d.updatedAt)) FROM Deal d " +
           "WHERE d.status = 'WON' AND d.updatedAt BETWEEN :startDate AND :endDate")
    Double getAvgDealCycleTime(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT CAST(COUNT(d) AS double)/(SELECT COUNT(d2) FROM Deal d2) FROM Deal d WHERE d.status = 'WON'")
    Double getOverallWinRate();
    
    @Query("SELECT CAST(COUNT(d) AS double)/(SELECT COUNT(d2) FROM Deal d2 WHERE d2.createdAt BETWEEN :startDate AND :endDate) " +
           "FROM Deal d WHERE d.status = 'WON' AND d.createdAt BETWEEN :startDate AND :endDate")
    Double getWinRateBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
} 