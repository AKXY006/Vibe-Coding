package com.restaurant.service.impl;

import com.restaurant.dto.request.ReservationRequest;
import com.restaurant.dto.request.UpdateReservationStatusRequest;
import com.restaurant.dto.response.ReservationResponse;
import com.restaurant.entity.Reservation;
import com.restaurant.entity.ReservationStatus;
import com.restaurant.entity.User;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.ReservationRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ReservationResponse bookTable(ReservationRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .guests(request.getGuests())
                .reservationDate(request.getReservationDate())
                .reservationTime(request.getReservationTime())
                .tableType(request.getTableType() != null ? request.getTableType() : "Standard Dining")
                .specialRequests(request.getSpecialRequests())
                .status(ReservationStatus.PENDING)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return mapToReservationResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return mapToReservationResponse(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByReservationDateDescReservationTimeDesc().stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserIdOrderByReservationDateDescReservationTimeDesc(userId).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReservationResponse updateReservationStatus(Long id, UpdateReservationStatusRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus(request.getStatus());
        Reservation updated = reservationRepository.save(reservation);
        return mapToReservationResponse(updated);
    }

    @Override
    @Transactional
    public void cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    private ReservationResponse mapToReservationResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .userId(reservation.getUser() != null ? reservation.getUser().getId() : null)
                .customerName(reservation.getCustomerName())
                .customerEmail(reservation.getCustomerEmail())
                .customerPhone(reservation.getCustomerPhone())
                .guests(reservation.getGuests())
                .reservationDate(reservation.getReservationDate())
                .reservationTime(reservation.getReservationTime())
                .tableType(reservation.getTableType())
                .specialRequests(reservation.getSpecialRequests())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
