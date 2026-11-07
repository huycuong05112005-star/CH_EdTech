# Skill: spring-boot-engineering

## Description
Sets high engineering standards for the Spring Boot 3.4+ backend on Java 21/25.

## Scope & Applicability
- pps/api REST endpoints, service layer, security filters, JPA repositories, and configuration.

## Rules & Principles
1. Enforce constructor dependency injection; avoid field injection with @Autowired.
2. Use Jakarta Bean Validation (@Valid, @NotNull, @Size) on all request DTOs.
3. Manage database evolution exclusively with Flyway migrations.
4. Prevent N+1 query problems in JPA using @EntityGraph or targeted join fetches.
5. Provide consistent global exception handling with @RestControllerAdvice.

## Checklist
- [ ] Request validation on all POST/PUT/PATCH endpoints.
- [ ] Global exception handler returns standard problem JSON.
- [ ] Open-in-view disabled (spring.jpa.open-in-view=false).
