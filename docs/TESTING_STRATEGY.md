# Testing & Quality Assurance Strategy

1. **Unit Testing:**
   - Frontend & Geometry: Node test runner (packages/geometry-core/tests/).
   - Backend: JUnit 5, Mockito, Spring Boot Test (pps/api/src/test/).
2. **Integration Testing:** Flyway schema migration validation, S3 container integration, pgvector query validation.
3. **Security Audits:** Live black-box scanning via check.py (.agents/skills/vibe-check/scripts/check.py).
