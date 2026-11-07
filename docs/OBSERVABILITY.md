# Observability & Telemetry Architecture

## 1. Components
- **Spring Boot Actuator & Micrometer:** Exposes real JVM, database connection pool (HikariCP), and HTTP metrics on /actuator/prometheus.
- **Prometheus (v2.53.0):** Scrapes Spring Boot backend every 5 seconds.
- **Grafana (v11.0.0):** Visualizes system health and HTTP latency on port 3000.
- **Grafana Loki (v3.0.0):** Centralized log aggregation on port 3100.

## 2. Pre-Provisioned Dashboards
- CH EdTech Overview dashboard pre-configured with Service Status and HTTP Request Rates.
