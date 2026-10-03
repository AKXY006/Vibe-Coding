package com.restaurant.service;

import com.restaurant.dto.request.FoodRequest;
import com.restaurant.dto.response.FoodResponse;
import com.restaurant.entity.FoodCategory;

import java.util.List;

public interface FoodService {
    FoodResponse addFood(FoodRequest request);
    FoodResponse updateFood(Long id, FoodRequest request);
    void deleteFood(Long id);
    FoodResponse getFoodById(Long id);
    List<FoodResponse> getAllFoods(String category, String search, String sortBy, Boolean isPopular);
    List<FoodResponse> getFoodsByCategory(FoodCategory category);
    List<FoodResponse> getPopularFoods();
    List<String> getAllCategories();
}
