package com.restaurant.controller;

import com.restaurant.dto.request.ContactMessageRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.ContactMessageResponse;
import com.restaurant.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private ContactMessageService contactMessageService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> sendMessage(
            @Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = contactMessageService.saveMessage(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you! Your message has been sent.", response));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactMessageResponse>>> getAllMessages() {
        List<ContactMessageResponse> messages = contactMessageService.getAllMessages();
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> markAsRead(@PathVariable Long id) {
        ContactMessageResponse response = contactMessageService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }
}
