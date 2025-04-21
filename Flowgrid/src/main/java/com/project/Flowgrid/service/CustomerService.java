package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.CustomerStatus;
import com.project.Flowgrid.dto.CustomerDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.CustomerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<CustomerDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return convertToDTO(customer);
    }

    public Optional<CustomerDTO> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .map(this::convertToDTO);
    }

    public List<CustomerDTO> getCustomersByStatus(CustomerStatus status) {
        return customerRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<CustomerDTO> searchCustomers(String searchTerm, Pageable pageable) {
        return customerRepository.searchCustomers(searchTerm, pageable)
                .map(this::convertToDTO);
    }

    @Transactional
    public CustomerDTO createCustomer(@Valid CustomerDTO customerDTO) {
        // Check if customer with same email already exists
        if (customerRepository.existsByEmail(customerDTO.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + customerDTO.getEmail() + " already exists");
        }

        Customer customer = convertToEntity(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        // If email is being changed, check that it doesn't conflict with another customer
        if (!existingCustomer.getEmail().equals(customerDTO.getEmail()) &&
                customerRepository.existsByEmail(customerDTO.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + customerDTO.getEmail() + " already exists");
        }

        // Update the customer entity
        existingCustomer.setFirstName(customerDTO.getFirstName());
        existingCustomer.setLastName(customerDTO.getLastName());
        existingCustomer.setEmail(customerDTO.getEmail());
        existingCustomer.setPhoneNumber(customerDTO.getPhoneNumber());
        existingCustomer.setCompany(customerDTO.getCompany());
        existingCustomer.setNotes(customerDTO.getNotes());
        existingCustomer.setStatus(customerDTO.getStatus());

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return convertToDTO(updatedCustomer);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    // Utility methods to convert between entities and DTOs
    private CustomerDTO convertToDTO(Customer customer) {
        return CustomerDTO.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .company(customer.getCompany())
                .notes(customer.getNotes())
                .status(customer.getStatus())
                .dealCount(customer.getDeals() != null ? customer.getDeals().size() : 0)
                .taskCount(customer.getTasks() != null ? customer.getTasks().size() : 0)
                .interactionCount(customer.getInteractions() != null ? customer.getInteractions().size() : 0)
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    private Customer convertToEntity(CustomerDTO customerDTO) {
        return Customer.builder()
                .id(customerDTO.getId())
                .firstName(customerDTO.getFirstName())
                .lastName(customerDTO.getLastName())
                .email(customerDTO.getEmail())
                .phoneNumber(customerDTO.getPhoneNumber())
                .company(customerDTO.getCompany())
                .notes(customerDTO.getNotes())
                .status(customerDTO.getStatus())
                .build();
    }
} 
