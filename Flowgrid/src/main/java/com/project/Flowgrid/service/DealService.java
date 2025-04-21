package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.DealStatus;
import com.project.Flowgrid.domain.PipelineStage;
import com.project.Flowgrid.dto.DealDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.PipelineStageRepository;
import com.project.Flowgrid.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final CustomerRepository customerRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final UserRepository userRepository;

    public List<DealDTO> getAllDeals() {
        return dealRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<DealDTO> getAllDeals(Pageable pageable) {
        return dealRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public DealDTO getDealById(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
        return convertToDTO(deal);
    }

    public List<DealDTO> getDealsByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        
        return dealRepository.findByCustomer(customer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DealDTO> getDealsByStatus(DealStatus status) {
        return dealRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DealDTO> getDealsByStageId(Long stageId) {
        PipelineStage stage = pipelineStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + stageId));
        
        return dealRepository.findByStage(stage).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DealDTO createDeal(@Valid DealDTO dealDTO) {
        Deal deal = convertToEntity(dealDTO);
        Deal savedDeal = dealRepository.save(deal);
        return convertToDTO(savedDeal);
    }

    @Transactional
    public DealDTO updateDeal(Long id, DealDTO dealDTO) {
        Deal existingDeal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));

        updateDealFromDTO(existingDeal, dealDTO);
        Deal updatedDeal = dealRepository.save(existingDeal);
        return convertToDTO(updatedDeal);
    }

    @Transactional
    public DealDTO updateDealStage(Long id, Long stageId) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
        
        PipelineStage stage = pipelineStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + stageId));
        
        deal.setStage(stage);
        
        // If the stage has a default probability, update the deal's probability
        if (stage.getProbability() != null) {
            deal.setProbability(stage.getProbability());
        }
        
        Deal updatedDeal = dealRepository.save(deal);
        return convertToDTO(updatedDeal);
    }

    @Transactional
    public void deleteDeal(Long id) {
        if (!dealRepository.existsById(id)) {
            throw new ResourceNotFoundException("Deal not found with id: " + id);
        }
        dealRepository.deleteById(id);
    }

    // Utility methods
    private DealDTO convertToDTO(Deal deal) {
        return DealDTO.builder()
                .id(deal.getId())
                .title(deal.getTitle())
                .amount(deal.getAmount())
                .probability(deal.getProbability())
                .status(deal.getStatus())
                .customerId(deal.getCustomer().getId())
                .customerName(deal.getCustomer().getFirstName() + " " + deal.getCustomer().getLastName())
                .stageId(deal.getStage().getId())
                .stageName(deal.getStage().getName())
                .assignedUserId(deal.getAssignedUser() != null ? deal.getAssignedUser().getId() : null)
                .assignedUserName(deal.getAssignedUser() != null ? deal.getAssignedUser().getUsername() : null)
                .expectedCloseDate(deal.getExpectedCloseDate())
                .notes(deal.getNotes())
                .taskCount(deal.getTasks() != null ? deal.getTasks().size() : 0)
                .createdAt(deal.getCreatedAt())
                .updatedAt(deal.getUpdatedAt())
                .build();
    }

    private Deal convertToEntity(DealDTO dealDTO) {
        Customer customer = customerRepository.findById(dealDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + dealDTO.getCustomerId()));
        
        PipelineStage stage = pipelineStageRepository.findById(dealDTO.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + dealDTO.getStageId()));
        
        Deal deal = Deal.builder()
                .id(dealDTO.getId())
                .title(dealDTO.getTitle())
                .amount(dealDTO.getAmount())
                .probability(dealDTO.getProbability())
                .status(dealDTO.getStatus())
                .customer(customer)
                .stage(stage)
                .expectedCloseDate(dealDTO.getExpectedCloseDate())
                .notes(dealDTO.getNotes())
                .build();
        
        if (dealDTO.getAssignedUserId() != null) {
            userRepository.findById(dealDTO.getAssignedUserId())
                    .ifPresent(deal::setAssignedUser);
        }
        
        return deal;
    }
    
    private void updateDealFromDTO(Deal deal, DealDTO dealDTO) {
        deal.setTitle(dealDTO.getTitle());
        deal.setAmount(dealDTO.getAmount());
        deal.setProbability(dealDTO.getProbability());
        deal.setStatus(dealDTO.getStatus());
        deal.setExpectedCloseDate(dealDTO.getExpectedCloseDate());
        deal.setNotes(dealDTO.getNotes());
        
        if (dealDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dealDTO.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + dealDTO.getCustomerId()));
            deal.setCustomer(customer);
        }
        
        if (dealDTO.getStageId() != null) {
            PipelineStage stage = pipelineStageRepository.findById(dealDTO.getStageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pipeline stage not found with id: " + dealDTO.getStageId()));
            deal.setStage(stage);
        }
        
        if (dealDTO.getAssignedUserId() != null) {
            userRepository.findById(dealDTO.getAssignedUserId())
                    .ifPresent(deal::setAssignedUser);
        } else {
            deal.setAssignedUser(null);
        }
    }
} 
