# Deployment Guide

1. **Development Environment:**
   - Docker Compose for infrastructure (postgres, minio, prometheus, grafana, loki).
   - Maven Wrapper for backend.
   - Vite for frontend.
2. **Production Staging:**
   - Multi-stage Docker container builds.
   - Cloudflare WAF, DNS, and Turnstile fronting the application.
   - Cloudflare R2 bucket for zero egress object storage.
