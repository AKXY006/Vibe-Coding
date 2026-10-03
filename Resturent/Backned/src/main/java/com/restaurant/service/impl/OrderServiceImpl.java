package com.restaurant.service.impl;

import com.restaurant.dto.request.OrderCreateRequest;
import com.restaurant.dto.request.OrderItemRequest;
import com.restaurant.dto.request.UpdateOrderStatusRequest;
import com.restaurant.dto.response.OrderItemResponse;
import com.restaurant.dto.response.OrderResponse;
import com.restaurant.entity.*;
import com.restaurant.exception.BadRequestException;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.*;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        // Fallback to guest or default customer if user is not logged in
        if (user == null) {
            user = userRepository.findByEmail("user@restaurant.com")
                    .orElseGet(() -> {
                        List<User> allUsers = userRepository.findAll();
                        return allUsers.isEmpty() ? null : allUsers.get(0);
                    });
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double subTotal = 0.0;

        // Check if items are passed explicitly in request
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequest itemReq : request.getItems()) {
                Food food = foodRepository.findById(itemReq.getFoodId())
                        .orElse(null);

                String name = (food != null) ? food.getName() : "Culinary Item #" + itemReq.getFoodId();
                String image = (food != null) ? food.getImage() : "";
                double price = (food != null) ? food.getPrice() : 19.99;

                double itemTotal = price * itemReq.getQuantity();
                subTotal += itemTotal;

                OrderItem orderItem = OrderItem.builder()
                        .food(food)
                        .foodName(name)
                        .foodImage(image)
                        .price(price)
                        .quantity(itemReq.getQuantity())
                        .subTotal(itemTotal)
                        .build();
                orderItems.add(orderItem);
            }
        } else if (user != null) {
            // Alternatively, pull items from user's cart
            Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
            if (cart != null && !cart.getItems().isEmpty()) {
                for (CartItem cartItem : cart.getItems()) {
                    double itemTotal = cartItem.getPrice() * cartItem.getQuantity();
                    subTotal += itemTotal;

                    OrderItem orderItem = OrderItem.builder()
                            .food(cartItem.getFood())
                            .foodName(cartItem.getFood().getName())
                            .foodImage(cartItem.getFood().getImage())
                            .price(cartItem.getPrice())
                            .quantity(cartItem.getQuantity())
                            .subTotal(itemTotal)
                            .build();
                    orderItems.add(orderItem);
                }
            }
        }

        if (orderItems.isEmpty()) {
            throw new BadRequestException("Cannot create order without any items. Please add items to order.");
        }

        // Calculations: Delivery fee is 0 if total > 500, else 40
        double deliveryFee = (subTotal >= 50.0) ? 0.0 : 4.99;
        double tax = Math.round(subTotal * 0.08 * 100.0) / 100.0; // 8% tax
        double grandTotal = Math.round((subTotal + deliveryFee + tax) * 100.0) / 100.0;

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        String customerName = (request.getCustomerName() != null && !request.getCustomerName().isBlank())
                ? request.getCustomerName()
                : (user != null ? user.getName() : "Guest Diner");

        String customerPhone = (request.getCustomerPhone() != null && !request.getCustomerPhone().isBlank())
                ? request.getCustomerPhone()
                : (user != null ? user.getPhone() : "+1 (555) 000-0000");

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .totalAmount(subTotal)
                .deliveryFee(deliveryFee)
                .tax(tax)
                .grandTotal(grandTotal)
                .status(OrderStatus.PENDING)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD")
                .paymentStatus("PENDING")
                .build();

        Order savedOrder = orderRepository.save(order);

        // Associate and persist order items
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }
        savedOrder.setItems(orderItems);

        // Clear cart if requested and user exists
        if (Boolean.TRUE.equals(request.getClearCartAfterOrder()) && user != null) {
            cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
                cartItemRepository.deleteByCartId(cart.getId());
                cart.getItems().clear();
                cartRepository.save(cart);
            });
        }

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with orderNumber: " + orderNumber));
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(request.getStatus());
        if (request.getStatus() == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID");
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = (order.getItems() != null)
                ? order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .foodId(item.getFood() != null ? item.getFood().getId() : null)
                        .foodName(item.getFoodName())
                        .foodImage(item.getFoodImage())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subTotal(item.getSubTotal())
                        .build())
                .collect(Collectors.toList())
                : new ArrayList<>();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .deliveryFee(order.getDeliveryFee())
                .tax(order.getTax())
                .grandTotal(order.getGrandTotal())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
