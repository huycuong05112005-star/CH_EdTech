# Skill: devops-infrastructure

## Description
Oversees Docker orchestration, port conflict prevention, container networking, and deployment pipelines.

## Scope & Applicability
- docker-compose.yml, multi-stage Dockerfiles, network bridges, and host volume management.

## Rules & Principles
1. Prevent port collisions by checking host ports and parameterizing all container ports via .env.
2. Use named health checks (healthcheck) on database and storage containers so dependent services start safely.
3. Multi-stage builds for Docker images to minimize footprint and eliminate build tools from runtime.
4. Keep container data in declared Docker volumes or persistent mount paths.

## Checklist
- [ ] Docker Compose starts all services with zero port conflicts.
- [ ] Container health checks report healthy.
- [ ] Restart policies (estart: unless-stopped) properly configured.
