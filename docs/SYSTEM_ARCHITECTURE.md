# System Architecture Specification

\\\mermaid
flowchart TD
    subgraph ClientLayer [Client & Edge Layer]
        Browser["User Browser (React + Three.js)"]
        CF["Cloudflare (WAF / Rate Limit / DNS)"]
    end

    subgraph AppLayer [Application Core - Port 8085]
        API["Spring Boot 3.4 API Monolith"]
        Security["Spring Security (JWT Filter)"]
        StorageSvc["StorageService Abstraction"]
        GeoSvc["Geometry Engine Integration"]
    end

    subgraph DataLayer [Data & Storage Layer]
        PG[("PostgreSQL 16 (Port 5434)")]
        PGV[("pgvector HNSW Index")]
        MinIO[("MinIO Object Storage (Port 9000/9001)")]
    end

    subgraph ObservabilityLayer [Observability & Telemetry]
        Prom["Prometheus (Port 9090)"]
        Graf["Grafana Dashboards (Port 3000)"]
        Loki["Grafana Loki Logs (Port 3100)"]
    end

    Browser --> CF
    CF --> API
    API --> Security
    API --> StorageSvc
    API --> GeoSvc
    API --> PG
    PG --> PGV
    StorageSvc --> MinIO
    API -->|Metrics| Prom
    Prom --> Graf
    API -->|Logs| Loki
\\\
"@

    "docs\TECH_STACK.md" = @"
# Technology Stack & Selection Rationale

| Layer | Technology | Selection Rationale |
|---|---|---|
| Frontend | React 18, TypeScript, Vite | Modern, high performance, excellent developer tooling |
| 3D Graphics | Three.js | WebGL standards, interactive 3D spatial models |
| Styling | Tailwind CSS | Utility-first, clean aesthetic, responsive design |
| State | Zustand, TanStack Query | Lightweight client state and server state caching |
| Backend | Spring Boot 3.4+, Java 21 LTS | Enterprise stability, robust security ecosystem, modularity |
| Database | PostgreSQL 16 | ACID transactions, mature relational capabilities |
| Vector Engine | pgvector 0.8.7 | Unified relational + semantic vector storage |
| Object Storage | MinIO (Dev) / Cloudflare R2 (Prod) | S3 compatibility, zero-disk server coupling |
| Observability | Prometheus, Grafana, Loki | Real-time metric scraping, dashboards, centralized logs |
