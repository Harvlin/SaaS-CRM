package com.project.Flowgrid.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Flowgrid.domain.*;
import com.project.Flowgrid.dto.EmailMessageDTO;
import com.project.Flowgrid.dto.ScheduledEmailDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.repository.CustomerRepository;
import com.project.Flowgrid.repository.DealRepository;
import com.project.Flowgrid.repository.EmailTemplateRepository;
import com.project.Flowgrid.repository.ScheduledEmailRepository;
import com.project.Flowgrid.service.EmailService;
import com.project.Flowgrid.service.InteractionService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;
    private final ScheduledEmailRepository scheduledEmailRepository;
    private final EmailTemplateRepository emailTemplateRepository;
    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final InteractionService interactionService;
    private final ObjectMapper objectMapper;

    @Value("${spring.mail.username}")
    private String defaultFromEmail;

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{([^}]+)\\}\\}");

    @Override
    public boolean sendEmail(EmailMessageDTO emailMessageDTO) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set email properties
            helper.setFrom(emailMessageDTO.getFrom() != null ? emailMessageDTO.getFrom() : defaultFromEmail);
            helper.setTo(emailMessageDTO.getTo().toArray(new String[0]));
            
            if (emailMessageDTO.getCc() != null && !emailMessageDTO.getCc().isEmpty()) {
                helper.setCc(emailMessageDTO.getCc().toArray(new String[0]));
            }
            
            if (emailMessageDTO.getBcc() != null && !emailMessageDTO.getBcc().isEmpty()) {
                helper.setBcc(emailMessageDTO.getBcc().toArray(new String[0]));
            }

            // Handle template if provided
            String finalSubject = emailMessageDTO.getSubject();
            String finalContent = emailMessageDTO.getContent();
            
            if (emailMessageDTO.getTemplateId() != null) {
                EmailTemplate template = emailTemplateRepository.findById(emailMessageDTO.getTemplateId())
                        .orElseThrow(() -> new ResourceNotFoundException("Email template not found with ID: " + emailMessageDTO.getTemplateId()));
                
                Map<String, String> variables = emailMessageDTO.getTemplateVariables();
                
                if (variables != null) {
                    finalSubject = processTemplate(template.getSubject(), variables);
                    finalContent = processTemplate(template.getContent(), variables);
                } else {
                    finalSubject = template.getSubject();
                    finalContent = template.getContent();
                }
            }
            
            helper.setSubject(finalSubject);
            helper.setText(finalContent, true); // true indicates HTML content
            
            // Send the email
            emailSender.send(message);
            
            // Log the interaction if customer ID is provided
            if (emailMessageDTO.getCustomerId() != null) {
                logEmailInteraction(emailMessageDTO, finalSubject, finalContent);
            }
            
            return true;
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
            return false;
        }
    }

    @Override
    @Transactional
    public ScheduledEmailDTO scheduleEmail(EmailMessageDTO emailMessageDTO) {
        // Validate that the email has a scheduled time
        if (emailMessageDTO.getScheduledTime() == null) {
            throw new IllegalArgumentException("Scheduled time is required");
        }
        
        if (emailMessageDTO.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Scheduled time must be in the future");
        }
        
        ScheduledEmail scheduledEmail = new ScheduledEmail();
        scheduledEmail.setFromEmail(emailMessageDTO.getFrom() != null ? emailMessageDTO.getFrom() : defaultFromEmail);
        scheduledEmail.setToEmails(String.join(",", emailMessageDTO.getTo()));
        
        if (emailMessageDTO.getCc() != null && !emailMessageDTO.getCc().isEmpty()) {
            scheduledEmail.setCcEmails(String.join(",", emailMessageDTO.getCc()));
        }
        
        if (emailMessageDTO.getBcc() != null && !emailMessageDTO.getBcc().isEmpty()) {
            scheduledEmail.setBccEmails(String.join(",", emailMessageDTO.getBcc()));
        }
        
        scheduledEmail.setSubject(emailMessageDTO.getSubject());
        scheduledEmail.setContent(emailMessageDTO.getContent());
        scheduledEmail.setScheduledTime(emailMessageDTO.getScheduledTime());
        scheduledEmail.setStatus(EmailStatus.SCHEDULED);
        
        // Handle template if provided
        if (emailMessageDTO.getTemplateId() != null) {
            EmailTemplate template = emailTemplateRepository.findById(emailMessageDTO.getTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Email template not found with ID: " + emailMessageDTO.getTemplateId()));
            
            scheduledEmail.setTemplate(template);
            
            if (emailMessageDTO.getTemplateVariables() != null) {
                try {
                    scheduledEmail.setTemplateVariables(objectMapper.writeValueAsString(emailMessageDTO.getTemplateVariables()));
                } catch (JsonProcessingException e) {
                    log.error("Failed to serialize template variables", e);
                    throw new IllegalArgumentException("Invalid template variables");
                }
            }
        }
        
        // Handle customer if provided
        if (emailMessageDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(emailMessageDTO.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + emailMessageDTO.getCustomerId()));
            
            scheduledEmail.setCustomer(customer);
        }
        
        // Handle deal if provided
        if (emailMessageDTO.getDealId() != null) {
            Deal deal = dealRepository.findById(emailMessageDTO.getDealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + emailMessageDTO.getDealId()));
            
            scheduledEmail.setDeal(deal);
        }
        
        ScheduledEmail savedEmail = scheduledEmailRepository.save(scheduledEmail);
        return convertToDTO(savedEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduledEmailDTO> getAllScheduledEmails(Pageable pageable) {
        return scheduledEmailRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduledEmailDTO getScheduledEmailById(Long id) {
        ScheduledEmail scheduledEmail = scheduledEmailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled email not found with ID: " + id));
        
        return convertToDTO(scheduledEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduledEmailDTO> getScheduledEmailsByCustomerId(Long customerId, Pageable pageable) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        
        return scheduledEmailRepository.findByCustomer(customer, pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScheduledEmailDTO> getScheduledEmailsByDealId(Long dealId, Pageable pageable) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with ID: " + dealId));
        
        return scheduledEmailRepository.findByDeal(deal, pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public ScheduledEmailDTO cancelScheduledEmail(Long id) {
        ScheduledEmail scheduledEmail = scheduledEmailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled email not found with ID: " + id));
        
        if (scheduledEmail.getStatus() == EmailStatus.SENT) {
            throw new IllegalStateException("Cannot cancel an email that has already been sent");
        }
        
        scheduledEmail.setStatus(EmailStatus.CANCELLED);
        scheduledEmail.setUpdatedAt(LocalDateTime.now());
        
        ScheduledEmail savedEmail = scheduledEmailRepository.save(scheduledEmail);
        return convertToDTO(savedEmail);
    }

    @Override
    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void processScheduledEmails() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledEmail> emailsToSend = scheduledEmailRepository.findEmailsDueForSending(now, EmailStatus.SCHEDULED);
        
        for (ScheduledEmail email : emailsToSend) {
            // Prepare EmailMessageDTO
            EmailMessageDTO messageDTO = new EmailMessageDTO();
            messageDTO.setFrom(email.getFromEmail());
            messageDTO.setTo(Arrays.asList(email.getToEmails().split(",")));
            
            if (email.getCcEmails() != null && !email.getCcEmails().isEmpty()) {
                messageDTO.setCc(Arrays.asList(email.getCcEmails().split(",")));
            }
            
            if (email.getBccEmails() != null && !email.getBccEmails().isEmpty()) {
                messageDTO.setBcc(Arrays.asList(email.getBccEmails().split(",")));
            }
            
            String finalSubject = email.getSubject();
            String finalContent = email.getContent();
            
            // Process template if available
            if (email.getTemplate() != null) {
                Map<String, String> variables = null;
                
                if (email.getTemplateVariables() != null && !email.getTemplateVariables().isEmpty()) {
                    try {
                        variables = objectMapper.readValue(email.getTemplateVariables(), 
                                objectMapper.getTypeFactory().constructMapType(HashMap.class, String.class, String.class));
                    } catch (JsonProcessingException e) {
                        log.error("Failed to deserialize template variables", e);
                    }
                }
                
                if (variables != null) {
                    finalSubject = processTemplate(email.getTemplate().getSubject(), variables);
                    finalContent = processTemplate(email.getTemplate().getContent(), variables);
                } else {
                    finalSubject = email.getTemplate().getSubject();
                    finalContent = email.getTemplate().getContent();
                }
            }
            
            messageDTO.setSubject(finalSubject);
            messageDTO.setContent(finalContent);
            messageDTO.setCustomerId(email.getCustomer() != null ? email.getCustomer().getId() : null);
            messageDTO.setDealId(email.getDeal() != null ? email.getDeal().getId() : null);
            
            // Attempt to send the email
            boolean sent = sendEmail(messageDTO);
            
            // Update the scheduled email status
            email.setStatus(sent ? EmailStatus.SENT : EmailStatus.FAILED);
            
            if (sent) {
                email.setSentTime(LocalDateTime.now());
            }
            
            email.setUpdatedAt(LocalDateTime.now());
            scheduledEmailRepository.save(email);
        }
    }

    @Override
    public String processTemplate(String templateContent, Map<String, String> variables) {
        if (templateContent == null || variables == null) {
            return templateContent;
        }
        
        Matcher matcher = VARIABLE_PATTERN.matcher(templateContent);
        StringBuffer buffer = new StringBuffer();
        
        while (matcher.find()) {
            String variableName = matcher.group(1).trim();
            String replacement = variables.getOrDefault(variableName, "");
            matcher.appendReplacement(buffer, Matcher.quoteReplacement(replacement));
        }
        
        matcher.appendTail(buffer);
        return buffer.toString();
    }

    private void logEmailInteraction(EmailMessageDTO emailMessageDTO, String subject, String content) {
        try {
            com.project.Flowgrid.dto.InteractionDTO interactionDTO = new com.project.Flowgrid.dto.InteractionDTO();
            interactionDTO.setType(InteractionType.EMAIL);
            interactionDTO.setSubject(subject);
            interactionDTO.setContent(content);
            interactionDTO.setCustomerId(emailMessageDTO.getCustomerId());
            interactionDTO.setUserId(1L); // TODO: Get the actual user ID from security context
            interactionDTO.setDealId(emailMessageDTO.getDealId());
            interactionDTO.setInteractionDate(LocalDateTime.now());
            
            interactionService.createInteraction(interactionDTO);
        } catch (Exception e) {
            log.error("Failed to log email interaction", e);
        }
    }
    
    private ScheduledEmailDTO convertToDTO(ScheduledEmail email) {
        ScheduledEmailDTO.ScheduledEmailDTOBuilder builder = ScheduledEmailDTO.builder()
                .id(email.getId())
                .fromEmail(email.getFromEmail())
                .toEmails(Arrays.asList(email.getToEmails().split(",")))
                .subject(email.getSubject())
                .content(email.getContent())
                .scheduledTime(email.getScheduledTime())
                .status(email.getStatus())
                .sentTime(email.getSentTime())
                .createdAt(email.getCreatedAt())
                .updatedAt(email.getUpdatedAt());
        
        if (email.getCcEmails() != null && !email.getCcEmails().isEmpty()) {
            builder.ccEmails(Arrays.asList(email.getCcEmails().split(",")));
        }
        
        if (email.getBccEmails() != null && !email.getBccEmails().isEmpty()) {
            builder.bccEmails(Arrays.asList(email.getBccEmails().split(",")));
        }
        
        if (email.getTemplate() != null) {
            builder.templateId(email.getTemplate().getId())
                  .templateName(email.getTemplate().getName());
            
            if (email.getTemplateVariables() != null && !email.getTemplateVariables().isEmpty()) {
                try {
                    Map<String, String> variables = objectMapper.readValue(email.getTemplateVariables(), 
                            objectMapper.getTypeFactory().constructMapType(HashMap.class, String.class, String.class));
                    builder.templateVariables(variables);
                } catch (JsonProcessingException e) {
                    log.error("Failed to deserialize template variables", e);
                }
            }
        }
        
        if (email.getCustomer() != null) {
            builder.customerId(email.getCustomer().getId())
                  .customerName(email.getCustomer().getFullName());
        }
        
        if (email.getDeal() != null) {
            builder.dealId(email.getDeal().getId())
                  .dealTitle(email.getDeal().getTitle());
        }
        
        return builder.build();
    }
} 
