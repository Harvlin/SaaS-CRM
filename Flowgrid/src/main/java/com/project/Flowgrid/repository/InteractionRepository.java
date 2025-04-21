package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.Interaction;
import com.project.Flowgrid.domain.InteractionType;
import com.project.Flowgrid.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    List<Interaction> findByCustomer(Customer customer);
    
    Page<Interaction> findByCustomer(Customer customer, Pageable pageable);
    
    List<Interaction> findByUser(User user);
    
    Page<Interaction> findByUser(User user, Pageable pageable);
    
    List<Interaction> findByDeal(Deal deal);
    
    Page<Interaction> findByDeal(Deal deal, Pageable pageable);
    
    List<Interaction> findByType(InteractionType type);
    
    Page<Interaction> findByType(InteractionType type, Pageable pageable);
    
    List<Interaction> findByInteractionDateBetween(LocalDateTime start, LocalDateTime end);
    
    Page<Interaction> findByInteractionDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    Page<Interaction> findByCustomerIdOrderByInteractionDateDesc(Long customerId, Pageable pageable);
    
    long countByCustomerId(Long customerId);
    
    // Analytics queries
    
    @Query("SELECT i.type, COUNT(i) FROM Interaction i WHERE i.interactionDate BETWEEN :startDate AND :endDate GROUP BY i.type")
    List<Object[]> countByTypeAndDateRange(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
            
    Long countByUserId(Long userId);
    
    @Query("SELECT CAST(i.interactionDate AS LocalDate) as date, COUNT(i) " +
           "FROM Interaction i WHERE i.interactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(i.interactionDate AS LocalDate) ORDER BY date")
    List<Object[]> getInteractionCountByDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
} 