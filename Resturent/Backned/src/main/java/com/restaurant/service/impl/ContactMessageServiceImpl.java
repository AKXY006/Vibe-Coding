package com.restaurant.service.impl;

import com.restaurant.dto.request.ContactMessageRequest;
import com.restaurant.dto.response.ContactMessageResponse;
import com.restaurant.entity.ContactMessage;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.ContactMessageRepository;
import com.restaurant.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional
    public ContactMessageResponse saveMessage(ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .isRead(false)
                .build();

        ContactMessage saved = contactMessageRepository.save(message);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageResponse> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContactMessageResponse markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));

        message.setIsRead(true);
        ContactMessage updated = contactMessageRepository.save(message);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact message not found with id: " + id);
        }
        contactMessageRepository.deleteById(id);
    }

    private ContactMessageResponse mapToResponse(ContactMessage message) {
        return ContactMessageResponse.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .phone(message.getPhone())
                .subject(message.getSubject())
                .message(message.getMessage())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
