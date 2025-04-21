package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.Customer;
import com.project.Flowgrid.domain.Deal;
import com.project.Flowgrid.domain.Task;
import com.project.Flowgrid.domain.TaskStatus;
import com.project.Flowgrid.domain.User;
import com.project.Flowgrid.dto.TaskDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.TaskRepository;
import com.project.Flowgrid.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;

    @Transactional(readOnly = true)
    public Page<TaskDTO> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        return convertToDTO(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByAssignedUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return taskRepository.findByAssignedUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        return taskRepository.findByCustomer(customer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByDealId(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dealId));
        return taskRepository.findByDeal(deal).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByDueDate(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDueDateBetween(start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(@Valid TaskDTO taskDTO) {
        Task task = convertToEntity(taskDTO);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        updateTaskFromDTO(existingTask, taskDTO);
        existingTask.setUpdatedAt(LocalDateTime.now());
        
        Task updatedTask = taskRepository.save(existingTask);
        return convertToDTO(updatedTask);
    }

    @Transactional
    public TaskDTO completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        
        Task completedTask = taskRepository.save(task);
        return convertToDTO(completedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with ID: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO.TaskDTOBuilder builder = TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .completedAt(task.getCompletedAt())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt());
        
        if (task.getAssignedUser() != null) {
            builder.assignedUserId(task.getAssignedUser().getId())
                    .assignedUserName(task.getAssignedUser().getUsername());
        }
        
        if (task.getCustomer() != null) {
            builder.customerId(task.getCustomer().getId())
                    .customerName(task.getCustomer().getFullName());
        }
        
        if (task.getDeal() != null) {
            builder.dealId(task.getDeal().getId())
                    .dealTitle(task.getDeal().getTitle());
        }
        
        return builder.build();
    }

    private Task convertToEntity(TaskDTO dto) {
        Task.TaskBuilder builder = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .status(dto.getStatus())
                .completedAt(dto.getCompletedAt())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt());

        if (dto.getId() != null) {
            builder.id(dto.getId());
        }
        
        if (dto.getAssignedUserId() != null) {
            User user = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getAssignedUserId()));
            builder.assignedUser(user);
        }
        
        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));
            builder.customer(customer);
        }
        
        if (dto.getDealId() != null) {
            Deal deal = dealRepository.findById(dto.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dto.getDealId()));
            builder.deal(deal);
        }
        
        return builder.build();
    }

    private void updateTaskFromDTO(Task task, TaskDTO dto) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        
        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
            if (dto.getStatus() == TaskStatus.COMPLETED && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
        }
        
        if (dto.getCompletedAt() != null) {
            task.setCompletedAt(dto.getCompletedAt());
        }
        
        if (dto.getAssignedUserId() != null) {
            User user = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getAssignedUserId()));
            task.setAssignedUser(user);
        } else {
            task.setAssignedUser(null);
        }
        
        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));
            task.setCustomer(customer);
        } else {
            task.setCustomer(null);
        }
        
        if (dto.getDealId() != null) {
            Deal deal = dealRepository.findById(dto.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dto.getDealId()));
            task.setDeal(deal);
        } else {
            task.setDeal(null);
        }
    }
} 
