# Skill: performance-testing

## Description
Defines load testing scenarios, latency criteria, and capacity analysis for CH EdTech services.

## Scope & Applicability
- k6 performance scripts, API throughput benchmarks, and database stress testing.

## Rules & Principles
1. Never claim concurrent user limits (e.g., 10,000 users) without reproducible load test evidence.
2. Benchmark critical paths: Auth verification, Geometry rendering, Vector similarity search, Pre-signed URL generation.
3. Target API p95 latency under 200ms for core endpoints; vector search under 50ms.
4. Monitor memory and CPU utilization under sustained load using Prometheus metrics.

## Checklist
- [ ] k6 test scripts created in 	ests/performance/.
- [ ] Baseline performance benchmarks recorded in docs/EXPERIMENT_LOG.md.
- [ ] Bottleneck identification and remediation documented.
