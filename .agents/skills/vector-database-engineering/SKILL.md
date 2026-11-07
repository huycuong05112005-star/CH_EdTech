# Skill: vector-database-engineering

## Description
Guides vector embedding storage, indexing, and high-performance semantic retrieval using pgvector.

## Scope & Applicability
- Mathematical theorem search, curriculum semantic lookup, and AI Agent RAG context retrieval.

## Rules & Principles
1. Unified relational + vector data model within PostgreSQL using pgvector extension.
2. Create HNSW indexes (m = 16, ef_construction = 64) or IVFFlat for fast approximate nearest neighbor search.
3. Manage embedding dimensions dynamically via configuration (e.g., 1536 for OpenAI small).
4. Strictly filter vector searches by tenant, course, and user role to prevent unauthorized data retrieval.

## Checklist
- [ ] CREATE EXTENSION IF NOT EXISTS vector; verified.
- [ ] HNSW / IVFFlat index created on embedding column.
- [ ] Role-based access control combined with similarity query.
