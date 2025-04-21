package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.Task;
import com.project.Flowgrid.domain.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUserId(Long userId);
    
    Page<Task> findByAssignedUserId(Long userId, Pageable pageable);
    
    List<Task> findByCustomer(Customer customer);
    
    Page<Task> findByCustomer(Customer customer, Pageable pageable);
    
    List<Task> findByDeal(Deal deal);
    
    Page<Task> findByDeal(Deal deal, Pageable pageable);
    
    List<Task> findByStatus(TaskStatus status);
    
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    
    List<Task> findByDueDateBetween(LocalDateTime start, LocalDateTime end);
    
    Page<Task> findByDueDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    List<Task> findByAssignedUserIdAndDueDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    // Analytics queries
    
    Long countByStatus(TaskStatus status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.status != 'COMPLETED'")
    Long countOverdueTasks();
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate >= CURRENT_DATE AND t.dueDate < CURRENT_DATE + 1 AND t.status != 'COMPLETED'")
    Long countTasksDueToday();
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'COMPLETED' AND " +
           "t.completedAt >= CURRENT_DATE - 7")
    Long countTasksCompletedThisWeek();
    
    @Query("SELECT t.assignedUser.id, COUNT(t) FROM Task t WHERE t.assignedUser IS NOT NULL GROUP BY t.assignedUser.id")
    List<Object[]> getTaskCountByUser();
    
    @Query("SELECT t.assignedUser.id, COUNT(t) FROM Task t WHERE t.assignedUser IS NOT NULL AND t.status = :status GROUP BY t.assignedUser.id")
    List<Object[]> getTaskCountByUserAndStatus(@Param("status") TaskStatus status);
    
    @Query("SELECT t.assignedUser.id, COUNT(t) FROM Task t WHERE t.assignedUser IS NOT NULL AND t.dueDate < CURRENT_TIMESTAMP AND t.status != 'COMPLETED' " +
           "GROUP BY t.assignedUser.id")
    List<Object[]> getOverdueTaskCountByUser();
    
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskCountByStatus();
    
    @Query("SELECT CAST(t.createdAt AS LocalDate) as date, COUNT(t) " +
           "FROM Task t WHERE t.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(t.createdAt AS LocalDate) ORDER BY date")
    List<Object[]> getTaskCountByDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t.status, CAST(t.createdAt AS LocalDate) as date, COUNT(t) " +
           "FROM Task t WHERE t.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY t.status, CAST(t.createdAt AS LocalDate) ORDER BY date")
    List<Object[]> getTaskCountByStatusAndDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(FUNCTION('DATEDIFF', t.completedAt, t.createdAt)) FROM Task t " +
           "WHERE t.status = 'COMPLETED' AND t.completedAt IS NOT NULL")
    Double getAverageTimeToComplete();
} 