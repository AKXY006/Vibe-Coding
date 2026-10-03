package com.restaurant.service;

import com.restaurant.dto.request.ReservationRequest;
import com.restaurant.dto.request.UpdateReservationStatusRequest;
import com.restaurant.dto.response.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse bookTable(ReservationRequest request);
    ReservationResponse getReservationById(Long id);
    List<ReservationResponse> getAllReservations();
    List<ReservationResponse> getReservationsByUserId(Long userId);
    ReservationResponse updateReservationStatus(Long id, UpdateReservationStatusRequest request);
    void cancelReservation(Long id);
}
