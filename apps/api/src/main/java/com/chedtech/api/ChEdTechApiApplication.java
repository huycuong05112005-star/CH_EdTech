package com.chedtech.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ChEdTechApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChEdTechApiApplication.class, args);
    }
}

