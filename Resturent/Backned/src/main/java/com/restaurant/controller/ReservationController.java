package com.restaurant.controller;

import com.restaurant.dto.request.ReservationRequest;
import com.restaurant.dto.request.UpdateReservationStatusRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.ReservationResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.service.ReservationService;
import com.restaurant.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<ReservationResponse>> bookTable(
            Authentication authentication,
            @Valid @RequestBody ReservationRequest request) {
        if (request.getUserId() == null && authentication != null && authentication.isAuthenticated()) {
            try {
                UserResponse user = userService.getUserByEmail(authentication.getName());
                request.setUserId(user.getId());
            } catch (Exception ignored) {}
        }
        ReservationResponse response = reservationService.bookTable(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Table booked successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(@PathVariable Long id) {
        ReservationResponse response = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations() {
        List<ReservationResponse> list = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(Authentication authentication) {
        UserResponse user = userService.getUserByEmail(authentication.getName());
        List<ReservationResponse> list = reservationService.getReservationsByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservationsByUserId(@PathVariable Long userId) {
        List<ReservationResponse> list = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationStatusRequest request) {
        ReservationResponse response = reservationService.updateReservationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Reservation status updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled successfully", null));
    }
}
