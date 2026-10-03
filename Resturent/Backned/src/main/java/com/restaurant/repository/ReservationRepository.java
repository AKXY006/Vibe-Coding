package com.restaurant.repository;

import com.restaurant.entity.Reservation;
import com.restaurant.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdOrderByReservationDateDescReservationTimeDesc(Long userId);
    List<Reservation> findAllByOrderByReservationDateDescReservationTimeDesc();
    List<Reservation> findByReservationDate(LocalDate date);
    List<Reservation> findByStatus(ReservationStatus status);
}
