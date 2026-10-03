package com.restaurant.controller;

import com.restaurant.dto.request.AddToCartRequest;
import com.restaurant.dto.request.UpdateCartItemRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.CartResponse;
import com.restaurant.dto.response.UserResponse;
import com.restaurant.service.CartService;
import com.restaurant.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    private Long getUserIdFromAuth(Authentication authentication) {
        UserResponse user = userService.getUserByEmail(authentication.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            Authentication authentication,
            @Valid @RequestBody UpdateCartItemRequest request) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.updateCartItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            Authentication authentication,
            @PathVariable Long itemId) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.removeFromCart(userId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse cart = cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }
}
