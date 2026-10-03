package com.restaurant.repository;

import com.restaurant.entity.Food;
import com.restaurant.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategory(FoodCategory category);

    List<Food> findByIsPopularTrue();

    List<Food> findByNameContainingIgnoreCase(String name);

    List<Food> findByCategoryAndNameContainingIgnoreCase(FoodCategory category, String name);

    List<Food> findByIsVegetarianTrue();

    @Query("SELECT f FROM Food f WHERE " +
           "(:category IS NULL OR f.category = :category) AND " +
           "(:search IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Food> searchFoods(@Param("category") FoodCategory category, @Param("search") String search);
}
