package com.restaurant.service;

import com.restaurant.dto.request.OrderCreateRequest;
import com.restaurant.dto.request.UpdateOrderStatusRequest;
import com.restaurant.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderCreateRequest request);
    OrderResponse getOrderById(Long orderId);
    OrderResponse getOrderByOrderNumber(String orderNumber);
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
}
