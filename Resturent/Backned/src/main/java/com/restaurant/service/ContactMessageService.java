package com.restaurant.service;

import com.restaurant.dto.request.ContactMessageRequest;
import com.restaurant.dto.response.ContactMessageResponse;

import java.util.List;

public interface ContactMessageService {
    ContactMessageResponse saveMessage(ContactMessageRequest request);
    List<ContactMessageResponse> getAllMessages();
    ContactMessageResponse markAsRead(Long id);
    void deleteMessage(Long id);
}
