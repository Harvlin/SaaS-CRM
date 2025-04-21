package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.Interaction;
import com.project.Flowgrid.domain.InteractionType;
import com.project.Flowgrid.domain.User;
import com.project.Flowgrid.dto.InteractionDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.InteractionRepository;
import com.project.Flowgrid.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final DealRepository dealRepository;

    @Transactional(readOnly = true)
    public Page<InteractionDTO> getAllInteractions(Pageable pageable) {
        return interactionRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public InteractionDTO getInteractionById(Long id) {
        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interaction not found with ID: " + id));
        return convertToDTO(interaction);
    }

    @Transactional(readOnly = true)
    public Page<InteractionDTO> getInteractionsByCustomerId(Long customerId, Pageable pageable) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return interactionRepository.findByCustomerIdOrderByInteractionDateDesc(customerId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<InteractionDTO> getInteractionsByUserId(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return interactionRepository.findByUser(user, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<InteractionDTO> getInteractionsByDealId(Long dealId, Pageable pageable) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dealId));
        return interactionRepository.findByDeal(deal, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<InteractionDTO> getInteractionsByType(InteractionType type, Pageable pageable) {
        return interactionRepository.findByType(type, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<InteractionDTO> getInteractionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return interactionRepository.findByInteractionDateBetween(start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InteractionDTO createInteraction(@Valid InteractionDTO interactionDTO) {
        Interaction interaction = convertToEntity(interactionDTO);
        interaction.setCreatedAt(LocalDateTime.now());
        interaction.setUpdatedAt(LocalDateTime.now());
        
        Interaction savedInteraction = interactionRepository.save(interaction);
        return convertToDTO(savedInteraction);
    }

    @Transactional
    public InteractionDTO updateInteraction(Long id, InteractionDTO interactionDTO) {
        Interaction existingInteraction = interactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interaction not found with ID: " + id));

        updateInteractionFromDTO(existingInteraction, interactionDTO);
        existingInteraction.setUpdatedAt(LocalDateTime.now());
        
        Interaction updatedInteraction = interactionRepository.save(existingInteraction);
        return convertToDTO(updatedInteraction);
    }

    @Transactional
    public void deleteInteraction(Long id) {
        if (!interactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Interaction not found with ID: " + id);
        }
        interactionRepository.deleteById(id);
    }

    private InteractionDTO convertToDTO(Interaction interaction) {
        InteractionDTO.InteractionDTOBuilder builder = InteractionDTO.builder()
                .id(interaction.getId())
                .type(interaction.getType())
                .subject(interaction.getSubject())
                .content(interaction.getContent())
                .interactionDate(interaction.getInteractionDate())
                .createdAt(interaction.getCreatedAt())
                .updatedAt(interaction.getUpdatedAt());
        
        if (interaction.getCustomer() != null) {
            builder.customerId(interaction.getCustomer().getId())
                    .customerName(interaction.getCustomer().getFullName());
        }
        
        if (interaction.getUser() != null) {
            builder.userId(interaction.getUser().getId())
                    .userName(interaction.getUser().getUsername());
        }
        
        if (interaction.getDeal() != null) {
            builder.dealId(interaction.getDeal().getId())
                    .dealTitle(interaction.getDeal().getTitle());
        }
        
        return builder.build();
    }

    private Interaction convertToEntity(InteractionDTO dto) {
        Interaction.InteractionBuilder builder = Interaction.builder()
                .type(dto.getType())
                .subject(dto.getSubject())
                .content(dto.getContent())
                .interactionDate(dto.getInteractionDate());

        if (dto.getId() != null) {
            builder.id(dto.getId());
        }
        
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));
        builder.customer(customer);
        
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
        builder.user(user);
        
        if (dto.getDealId() != null) {
            Deal deal = dealRepository.findById(dto.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dto.getDealId()));
            builder.deal(deal);
        }
        
        if (dto.getCreatedAt() != null) {
            builder.createdAt(dto.getCreatedAt());
        }
        
        if (dto.getUpdatedAt() != null) {
            builder.updatedAt(dto.getUpdatedAt());
        }
        
        return builder.build();
    }

    private void updateInteractionFromDTO(Interaction interaction, InteractionDTO dto) {
        interaction.setType(dto.getType());
        interaction.setSubject(dto.getSubject());
        interaction.setContent(dto.getContent());
        interaction.setInteractionDate(dto.getInteractionDate());
        
        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));
            interaction.setCustomer(customer);
        }
        
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
            interaction.setUser(user);
        }
        
        if (dto.getDealId() != null) {
            Deal deal = dealRepository.findById(dto.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dto.getDealId()));
            interaction.setDeal(deal);
        } else {
            interaction.setDeal(null);
        }
    }
} 
