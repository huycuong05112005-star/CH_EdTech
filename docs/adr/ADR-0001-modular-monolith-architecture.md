# ADR-0001: Modular Monolith Architecture First

## Status
Accepted

## Context
CH EdTech is an advanced educational platform requiring multiple cohesive capabilities: Authentication, User Profiles, Geometry Engine, AI Agent RAG, Object Storage, and Course Management. Splitting these into distributed microservices at the inception stage would introduce network overhead, distributed transaction complexity, and excessive operational burden without traffic justification.

## Decision
Adopt a Modular Monolith architecture implemented with Spring Boot 3.4+ on Java 21/25. Maintain clean boundaries between domain packages (uth, storage, geometry, i, system) with strict dependency rules.

## Consequences
- **Positive:** Fast development velocity, single deployment pipeline, simplified database transactions, direct in-memory calls between modules.
- **Negative:** Requires disciplined code review to prevent tight coupling between domain modules.
