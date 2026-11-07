# Skill: ch-clean-code

## Description
Enforces high code readability, maintainability, SOLID principles, and clean design patterns across Java and TypeScript.

## Scope & Applicability
- Backend services, DTOs, controllers, and entities.
- Frontend components, custom hooks, and state stores.

## Rules & Principles
1. Self-documenting code with meaningful naming. Keep methods small and focused on a single responsibility.
2. Explicit types in TypeScript; avoid ny. Strict null checks enabled.
3. In Java, leverage records for DTOs, use constructor injection for Spring components, and avoid Lombok antipatterns.
4. Keep comments focused on 'why', not 'what'. Preserve essential architectural explanations.

## Checklist
- [ ] Methods under 30 lines where possible.
- [ ] Zero unhandled compiler/linter warnings.
- [ ] Immutability preferred for data transfer objects.
