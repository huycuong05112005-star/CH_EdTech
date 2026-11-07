# Skill: database-engineering

## Description
Governs relational database architecture, schema normalization, index strategies, and data integrity.

## Scope & Applicability
- PostgreSQL 16 schema, Flyway scripts, constraints, triggers, and query optimization.

## Rules & Principles
1. All foreign keys must have explicit indexes to avoid table locks during joins and cascade checks.
2. Standard audit columns on all entities: created_at, updated_at, created_by, status.
3. Soft delete or status flags where appropriate for auditability.
4. Use proper data types: UUID for identifiers, TIMESTAMPTZ for dates, JSONB for flexible math parameters.

## Checklist
- [ ] Flyway migrations versioned and reproducible.
- [ ] Query plans verified via EXPLAIN ANALYZE for complex queries.
- [ ] Database connection pool (HikariCP) sized appropriately.
