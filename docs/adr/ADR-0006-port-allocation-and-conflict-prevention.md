# ADR-0006: Port Allocation and Host Collision Avoidance

## Status
Accepted

## Context
On the Windows 11 development host, ports 5432 (Docker ch_academy_postgres), 8080 (Apache2.4 httpd), and 5173 (Node Vite CH_Academy) were already occupied by existing processes. Overwriting or terminating them violates core development principles.

## Decision
Explicitly parameterize all port bindings in .env and docker-compose.yml:
- Host PostgreSQL: 5434 (mapped to internal 5432)
- Spring Boot API: 8085 (SERVER_PORT=8085)
- Frontend Vite: 5175 (PORT=5175)
- MinIO S3 API: 9000 / Console: 9001
- Prometheus: 9090
- Grafana: 3000
- Loki: 3100

## Consequences
- **Positive:** Zero port collisions, completely peaceful coexistence with existing developer projects on the host machine.
- **Negative:** Developers must connect to PostgreSQL on port 5434 rather than default 5432.
