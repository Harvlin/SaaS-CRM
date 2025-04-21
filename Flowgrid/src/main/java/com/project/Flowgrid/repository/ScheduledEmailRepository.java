package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.EmailStatus;
import com.project.Flowgrid.domain.ScheduledEmail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledEmailRepository extends JpaRepository<ScheduledEmail, Long> {
    
    List<ScheduledEmail> findByStatus(EmailStatus status);
    
    Page<ScheduledEmail> findByStatus(EmailStatus status, Pageable pageable);
    
    List<ScheduledEmail> findByCustomer(Customer customer);
    
    Page<ScheduledEmail> findByCustomer(Customer customer, Pageable pageable);
    
    List<ScheduledEmail> findByDeal(Deal deal);
    
    Page<ScheduledEmail> findByDeal(Deal deal, Pageable pageable);
    
    @Query("SELECT e FROM ScheduledEmail e WHERE e.scheduledTime <= :time AND e.status = :status")
    List<ScheduledEmail> findEmailsDueForSending(
            @Param("time") LocalDateTime time, 
            @Param("status") EmailStatus status);
    
    @Query("SELECT e FROM ScheduledEmail e WHERE e.scheduledTime BETWEEN :start AND :end")
    List<ScheduledEmail> findByScheduledTimeBetween(
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    @Query("SELECT e FROM ScheduledEmail e WHERE e.scheduledTime BETWEEN :start AND :end")
    Page<ScheduledEmail> findByScheduledTimeBetween(
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end, 
            Pageable pageable);
    
    @Query("SELECT COUNT(e) FROM ScheduledEmail e WHERE e.customer.id = :customerId")
    long countByCustomerId(@Param("customerId") Long customerId);
} 
