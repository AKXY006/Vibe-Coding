package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestaurantBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurantBackendApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  Restaurant Backend Service Started Successfully! ");
        System.out.println("  Base URL: http://localhost:8080/api             ");
        System.out.println("=================================================");
    }
}
