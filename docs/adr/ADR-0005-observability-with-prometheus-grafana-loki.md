# ADR-0005: Full-Stack Observability with Prometheus, Grafana, and Loki

## Status
Accepted

## Context
Production platforms require continuous visibility into JVM heap, HTTP latency, connection pool usage, slow database queries, and structured application logs.

## Decision
Deploy an integrated observability stack in Docker Compose:
- **Prometheus (v2.53):** Metrics collection via Spring Boot Actuator (/actuator/prometheus).
- **Grafana (v11.0):** Centralized telemetry dashboards with pre-provisioned datasources and dashboards.
- **Loki (v3.0):** Centralized structured JSON log aggregation.

## Consequences
- **Positive:** Instant visibility into system bottlenecks, reproducible benchmark data, zero guesswork during incidents.
- **Negative:** Requires CPU and RAM allocation for container telemetry.
