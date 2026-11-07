# Skill: ch-architecture

## Description
Provides architecture blueprints, boundary definitions, and modularity principles for CH EdTech.

## Scope & Applicability
- High-level system design.
- Separation of Monolith domains (Auth, User, Academic, Geometry, AI, Storage, Audit).
- API contract definitions and event boundaries.

## Rules & Principles
1. Start with a decoupled Modular Monolith. Do not prematurely split into microservices without operational justification.
2. Maintain clean architectural boundaries between Domain, Application (Service), and Infrastructure layers.
3. Every major architectural decision must be accompanied by an ADR in docs/adr/.
4. Domain models must never leak S3 or provider-specific details.

## Checklist
- [ ] Layered architecture respected.
- [ ] ADR updated for significant changes.
- [ ] No circular dependencies between domain modules.
