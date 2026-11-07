# Environment Setup & Survey Report (Windows 11)

## 1. Surveyed Environment
- **OS:** Windows 11 (build 10.0.x, amd64)
- **Node.js:** v24.21.0 LTS (Active)
- **npm:** 11.19.0 (Active)
- **Java JDK:** Java 25.0.1 LTS (C:\Program Files\Java\jdk-25) with target release 21 compatibility.
- **Maven:** Apache Maven 3.9.9 cached in .m2/wrapper/dists. Maven Wrapper (mvnw.cmd) committed in project.
- **Python:** Python 3.14.7 (C:\Users\ADMIN\AppData\Local\Python\bin\python.exe).
- **Docker:** Docker Desktop v29.1.3, Docker Compose v2.40.3-desktop.1 (Daemon running).

## 2. Port Collision Prevention
| Service | Default Port | Conflict on Host | CH EdTech Port | Resolution Status |
|---|---|---|---|---|
| PostgreSQL | 5432 | Port taken by ch_academy_postgres | **5434** | Successfully mapped in docker-compose.yml |
| Spring Boot API | 8080 | Port taken by Apache2.4 (httpd) | **8085** | Configured in pplication.yml & .env |
| Frontend Vite | 5173 | Port taken by CH_Academy (node) | **5175** | Configured in ite.config.ts & package.json |
| MinIO S3 API | 9000 | Available | **9000** | Healthy & active |
| MinIO Console | 9001 | Available | **9001** | Healthy & active |
| Prometheus | 9090 | Available | **9090** | Healthy & active |
| Grafana | 3000 | Available | **3000** | Healthy & active |
| Loki | 3100 | Available | **3100** | Healthy & active |

## 3. Quick Start Guide
1. Copy .env.example to .env.
2. Start infrastructure: docker compose up -d
3. Verify containers: docker compose ps
4. Run Spring Boot backend: .\mvnw.cmd spring-boot:run -f apps/api/pom.xml
5. Run Frontend: 
pm run dev --prefix apps/web
"@

    "docs\DATABASE_DESIGN.md" = @"
# Database Design & Schema Architecture

## 1. Relational & Vector Storage Strategy
CH EdTech uses PostgreSQL 16 with the pgvector extension to unify relational entity management and high-dimensional semantic search within a single atomic database engine.

## 2. Schema Structure
- users: Core authentication, hashed credentials, roles (ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT), and lifecycle status.
- iles_metadata: Reference metadata for files stored in Object Storage. No binary data stored in database.
- geometry_models: Serialized 2D and 3D mathematical geometry definitions in JSONB.
- courses: Academic courses assigned to teachers.
- udit_logs: Detailed immutable audit trail for security and regulatory compliance.
- knowledge_documents: AI knowledge base root documents.
- document_chunks: Document text segments with embedding vector(1536) indexed via HNSW (m = 16, ef_construction = 64).

## 3. Flyway Migrations
- V1__init_schema.sql: Core relational tables and seeded default users.
- V2__init_pgvector.sql: pgvector tables and HNSW index.
