package com.project.Flowgrid.controller;

import com.project.Flowgrid.domain.CustomerStatus;
import com.project.Flowgrid.dto.CustomerDTO;
import com.project.Flowgrid.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(value = "search", required = false) String searchTerm) {
        
        Page<CustomerDTO> customers;
        if (searchTerm != null && !searchTerm.isEmpty()) {
            customers = customerService.searchCustomers(searchTerm, pageable);
        } else {
            customers = customerService.getAllCustomers(pageable);
        }
        
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CustomerDTO>> getCustomersByStatus(
            @PathVariable CustomerStatus status) {
        List<CustomerDTO> customers = customerService.getCustomersByStatus(status);
        return ResponseEntity.ok(customers);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO createdCustomer = customerService.createCustomer(customerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<CustomerDTO> updateCustomer(
            @PathVariable Long id, 
            @Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
} 
