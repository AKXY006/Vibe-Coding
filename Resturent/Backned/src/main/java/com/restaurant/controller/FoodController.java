package com.restaurant.controller;

import com.restaurant.dto.request.FoodRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.FoodResponse;
import com.restaurant.entity.FoodCategory;
import com.restaurant.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getAllFoods(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Boolean isPopular) {
        List<FoodResponse> foods = foodService.getAllFoods(category, search, sortBy, isPopular);
        return ResponseEntity.ok(ApiResponse.success(foods));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFoodById(@PathVariable Long id) {
        FoodResponse food = foodService.getFoodById(id);
        return ResponseEntity.ok(ApiResponse.success(food));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getFoodsByCategory(@PathVariable String category) {
        String normalized = category.trim().replace("-", "_").toUpperCase();
        FoodCategory foodCategory = FoodCategory.valueOf(normalized);
        List<FoodResponse> foods = foodService.getFoodsByCategory(foodCategory);
        return ResponseEntity.ok(ApiResponse.success(foods));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        List<String> categories = foodService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getPopularFoods() {
        List<FoodResponse> foods = foodService.getPopularFoods();
        return ResponseEntity.ok(ApiResponse.success(foods));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponse>> addFood(@Valid @RequestBody FoodRequest request) {
        FoodResponse food = foodService.addFood(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Food item added successfully", food));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(@PathVariable Long id,
                                                                @Valid @RequestBody FoodRequest request) {
        FoodResponse food = foodService.updateFood(id, request);
        return ResponseEntity.ok(ApiResponse.success("Food item updated successfully", food));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(ApiResponse.success("Food item deleted successfully", null));
    }
}
