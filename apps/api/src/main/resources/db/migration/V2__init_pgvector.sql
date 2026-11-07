-- V2: pgvector Integration for AI Knowledge Base & Semantic Search
-- Supports high-dimensional vector embeddings (1536 dimensions for text-embedding-3-small)

CREATE EXTENSION IF NOT EXISTS "vector";

-- Table: knowledge_documents
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'GEOMETRY_THEOREMS', 'CURRICULUM_GRADE_11', 'EXAM_PREP'
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'INTERNAL', 'TEACHER_ONLY')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: document_chunks (Stores chunked text and vector embeddings)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chunks_document ON document_chunks(document_id);

-- Create HNSW Index for ultra-fast approximate nearest neighbor vector search
-- Using cosine similarity operator (vector_cosine_ops)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

