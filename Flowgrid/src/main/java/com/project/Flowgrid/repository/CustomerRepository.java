package com.project.Flowgrid.repository;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Customer> findByStatus(CustomerStatus status);
    
    Page<Customer> findByStatus(CustomerStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.company) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> searchCustomers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Analytics queries
    
    Long countByStatus(CustomerStatus status);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    Long countCustomersCreatedBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = :status AND c.createdAt BETWEEN :startDate AND :endDate")
    Long countCustomersByStatusBetween(
            @Param("status") CustomerStatus status, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c.status, COUNT(c) FROM Customer c GROUP BY c.status")
    List<Object[]> getCustomerCountByStatus();
    
    @Query("SELECT CAST(c.createdAt AS LocalDate) as date, COUNT(c) " +
           "FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY CAST(c.createdAt AS LocalDate) ORDER BY date")
    List<Object[]> getCustomerCountByDay(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT YEAR(c.createdAt) as year, MONTH(c.createdAt) as month, COUNT(c) " +
           "FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(c.createdAt), MONTH(c.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> getCustomerCountByMonth(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT YEAR(c.createdAt) as year, FUNCTION('WEEK', c.createdAt) as week, COUNT(c) " +
           "FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(c.createdAt), FUNCTION('WEEK', c.createdAt) " +
           "ORDER BY year, week")
    List<Object[]> getCustomerCountByWeek(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT CAST(COUNT(c) AS double)/(SELECT COUNT(c2) FROM Customer c2 WHERE c2.status = 'LEAD') " +
           "FROM Customer c WHERE c.status IN ('ACTIVE', 'PROSPECT')")
    Double getLeadConversionRate();
    
    @Query("SELECT c.assignedUser.id, COUNT(c) FROM Customer c WHERE c.assignedUser IS NOT NULL GROUP BY c.assignedUser.id")
    List<Object[]> getCustomerCountByUser();
    
    @Query("SELECT c.assignedUser.id, COUNT(c) FROM Customer c " + 
           "WHERE c.assignedUser IS NOT NULL AND c.createdAt BETWEEN :startDate AND :endDate GROUP BY c.assignedUser.id")
    List<Object[]> getCustomerCountByUserBetween(
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
} 