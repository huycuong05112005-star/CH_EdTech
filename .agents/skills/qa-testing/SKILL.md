# Skill: qa-testing

## Description
Directs testing methodologies, test automation, assertions, and test coverage across the monorepo.

## Scope & Applicability
- Vitest and React Testing Library for Frontend.
- JUnit 5, Mockito, and Spring Boot Test for Backend.
- Playwright for End-to-End browser validation.

## Rules & Principles
1. Unit test mathematical algorithms in packages/geometry-core with high numerical rigor.
2. Integration test authentication, role authorization, and storage abstractions against real containers.
3. Do not rely on brittle frontend snapshot tests; test user-visible behavior and accessibility roles.
4. Automated tests must run locally and in CI before code merges.

## Checklist
- [ ] Unit tests for geometry primitives passing.
- [ ] Controller security test cases (401 unauthenticated, 403 unauthorized, 200 authorized).
- [ ] Test coverage reports generated.
