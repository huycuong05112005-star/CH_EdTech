# ADR-0002: PostgreSQL + pgvector for Unified Data and Semantic Search

## Status
Accepted

## Context
The AI Agent requires vector search for geometric theorems, syllabus retrieval, and RAG context. Dedicated vector databases (Pinecone, Qdrant, Milvus) introduce another stateful service to operate, back up, and secure.

## Decision
Utilize PostgreSQL 16 with the pgvector extension (version 0.8.7) and HNSW cosine indexes (m = 16, ef_construction = 64) for high-dimensional vector embeddings (1536 dimensions).

## Consequences
- **Positive:** Unified relational transactions, foreign key integrity between documents and vector chunks, single backup/restore lifecycle, zero additional infrastructure overhead.
- **Negative:** If vector queries exceed millions of operations per second in future growth, migration to an external vector cluster may be re-evaluated.
