# Skill: observability-engineering

## Description
Establishes comprehensive telemetry, monitoring, alerting, and structured logging across CH EdTech infrastructure.

## Scope & Applicability
- Spring Boot Actuator, Micrometer, Prometheus, Grafana, Loki, and Promtail.

## Rules & Principles
1. Expose real application metrics via /actuator/prometheus (JVM, HikariCP, HTTP requests, S3 latency).
2. Protect metrics and monitoring endpoints from unauthorized public access.
3. Centralize logs into Loki with structured JSON fields (	imestamp, level, service, 	race_id, message).
4. NEVER log sensitive credentials, passwords, raw JWT tokens, or personally identifiable information (PII).

## Checklist
- [ ] Prometheus scraping Actuator target every 15s.
- [ ] Grafana provisioned with System, Backend, Database, and Storage dashboards.
- [ ] Alerting thresholds configured for error spikes and downtime.
