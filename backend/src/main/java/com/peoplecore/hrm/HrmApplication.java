package com.peoplecore.hrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * PeopleCore HRM — Spring Boot entry point.
 *
 * <p>Exposes a REST API consumed by the React/Vite frontend.
 * JWT-secured, domain-layered architecture following best practices.
 */
@SpringBootApplication
@EnableScheduling
public class HrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(HrmApplication.class, args);
    }
}
