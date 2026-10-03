package com.restaurant.service;

import com.restaurant.dto.request.AddToCartRequest;
import com.restaurant.dto.request.UpdateCartItemRequest;
import com.restaurant.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Long userId);
    CartResponse getCartByUserEmail(String email);
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItem(Long userId, UpdateCartItemRequest request);
    CartResponse removeFromCart(Long userId, Long cartItemId);
    CartResponse clearCart(Long userId);
}
