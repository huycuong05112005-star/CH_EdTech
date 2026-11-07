# Database Design & Schema Architecture

## 1. Relational & Vector Storage Strategy
CH EdTech uses PostgreSQL 16 with the `pgvector` extension to unify relational entity management and high-dimensional semantic search within a single atomic database engine.

## 2. Schema Structure
- `users`: Core authentication, hashed credentials, roles (`ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`), and lifecycle status.
- `files_metadata`: Reference metadata for files stored in Object Storage. No binary data stored in database.
- `geometry_models`: Serialized 2D and 3D mathematical geometry definitions in `JSONB`.
- `courses`: Academic courses assigned to teachers.
- `audit_logs`: Detailed immutable audit trail for security and regulatory compliance.
- `knowledge_documents`: AI knowledge base root documents.
- `document_chunks`: Document text segments with `embedding vector(1536)` indexed via HNSW (`m = 16, ef_construction = 64`).

## 3. Flyway Migrations
- `V1__init_schema.sql`: Core relational tables and seeded default users.
- `V2__init_pgvector.sql`: pgvector tables and HNSW index.

