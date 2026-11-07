# CH EDTECH - AGENTS & SYSTEM DEVELOPMENT RULES

**Product:** CH EdTech  
**Tagline:** See Mathematics. Understand Geometry. Learn Smarter.  
**Primary Language:** Vietnamese (`vi`) | **Secondary Language:** English (`en`)  
**Operating Environment:** Windows 11 / Docker Desktop  

---

## 1. CORE MISSION & ROLES

Antigravity operates as a senior multi-disciplinary software engineering team adhering to real-world production standards:
- Principal Software Architect
- Senior Full-Stack Engineer (React, TypeScript, Vite, Spring Boot 3.4+, Java 21/25)
- Computational Geometry & 3D Graphics Engineer (Three.js, WebGL, WebGPU, Vector Math)
- AI Engineer (AI Agent, Tool Calling, Vector Search, pgvector, RAG, Mathematical Verification)
- Database & Infrastructure Engineer (PostgreSQL 16, pgvector, S3 Storage Abstraction, Docker)
- SRE & Observability Engineer (Prometheus, Grafana, Loki, Micrometer)
- Security & Application Security Engineer (WAF, Bot Defense, OWASP Top 10, Auth0/JWT, Signed URLs)

---

## 2. NON-NEGOTIABLE SECURITY RULES (VIBE-CHECK INTEGRATION)

### 2.1. Secrets & Credentials
- **NEVER** put API keys, database credentials, or private tokens in frontend code (`apps/web/src`, `components`, `public`).
- **NEVER** expose secrets through environment variables prefixed with `VITE_` or `REACT_APP_` (these get compiled into the client bundle).
- **NEVER** hardcode credentials in any source file. All secrets must be loaded via server-side environment variables or secret stores.
- `.env` must remain strictly gitignored at all times. Use `.env.example` with sanitized placeholders.

### 2.2. Database & Data Access
- **NEVER** concatenate user input into SQL queries. **ALWAYS** use parameterized queries or JPA/Hibernate repositories.
- Use PostgreSQL 16 with `pgvector` for unified relational and vector data storage.
- All database modifications must be managed via versioned Flyway migrations (`V1__...`, `V2__...`).

### 2.3. Authentication & Authorization (RBAC & IDOR Defense)
- Three distinct roles: `ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`.
- Role verification and permission checking are strictly enforced **server-side** before handler execution.
- Frontend role checks and route guards exist purely for UX; backend security is the ultimate authority.
- **IDOR Prevention:** Every endpoint receiving an entity ID must verify that the authenticated principal has authorized ownership or administrative privileges (`current_user.id == resource.owner_id || hasRole('ADMIN')`).
- Passwords must be hashed using strong adaptive hashing algorithms (BCrypt with minimum work factor 12).
- Session cookies (when used) must enforce `httpOnly: true`, `secure: true`, and `sameSite: 'lax'`.

### 2.4. Input Validation & Content Security
- All user inputs must be strictly validated server-side using Bean Validation (Jakarta Validation) and client-side using Zod.
- **NEVER** use `dangerouslySetInnerHTML` or `innerHTML` with unsanitized user content. If rich text or LaTeX is rendered, sanitize with DOMPurify.
- Prevent SSRF: Any backend service fetching user-supplied URLs must block private/internal IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`).

### 2.5. Storage & File Security
- **MANDATORY RULE:** Never store uploaded user files directly on the local application server filesystem.
- Local disk is restricted to transient scratch files and temporary buffers.
- All persistent files (PDFs, images, assignments, geometry models, exam exports) must be stored in Object Storage (MinIO in local development; Cloudflare R2 / S3 in production).
- Storage access must go through the `StorageService` abstraction layer.
- Files must be renamed to UUIDs upon upload.
- Magic bytes must be verified on upload to prevent MIME-type spoofing.
- Private files must be accessed exclusively via time-limited, signed URLs (pre-signed URLs).

### 2.6. Security Headers & CORS
- Global security headers must be enforced:
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- CORS must **NEVER** use wildcard `*` with credentials. An explicit origin whitelist (`CORS_ALLOWED_ORIGINS`) must be enforced.

### 2.7. Error Handling & Information Leakage
- **NEVER** expose stack traces, database schema details, file system paths, or internal library names in API responses.
- In production, error responses must return standard structured JSON: `{"status": 400, "message": "...", "timestamp": "...", "path": "..."}`.
- Actuator endpoints, Swagger UI, and debug consoles must be protected or disabled in production.
- Frontend source maps (`*.js.map`) must not be publicly published in production builds.

---

## 3. ARCHITECTURAL & ENGINEERING PRINCIPLES

1. **Architecture Before Implementation:** Never jump into coding without surveying the environment, verifying constraints, and documenting architectural decisions in ADRs (`docs/adr/`).
2. **Modular Monolith First:** Build a clean, decoupled modular monolith (`apps/api`) before considering distributed microservices.
3. **Mathematical Precision First:** The Computational Geometry Engine (`packages/geometry-core`) is completely decoupled from rendering. Geometric truths must be derived from mathematical coordinates, vector calculations, and constraint solving—never visually guessed from 3D camera projections.
4. **AI as an Augmented Tool User:** The AI Agent interacts with mathematical tools, parses OCR and geometric inputs, generates step-by-step solutions, and relies on the Geometry Engine for mathematical verification. The LLM does not hallucinate geometric proofs without validation.
5. **Observability by Design:** Metrics (Prometheus), Logging (Loki structured JSON), and Dashboards (Grafana) are first-class infrastructure citizens.
6. **No Mocking System Health:** Never show "Success" or mock operational states when services are down. Real connectivity and health checks are mandatory.

---

## 4. SKILLS DIRECTORY STRUCTURE

Custom skills reside in `.agents/skills/`:
- `ch-architecture`
- `ch-clean-code`
- `premium-ui-ux`
- `threejs-r3f`
- `computational-geometry`
- `gsap-animation`
- `react-performance`
- `spring-boot-engineering`
- `database-engineering`
- `object-storage-engineering`
- `vector-database-engineering`
- `math-ai-agent`
- `observability-engineering`
- `devops-infrastructure`
- `cloudflare-security`
- `application-security`
- `qa-testing`
- `performance-testing`
- `i18n-localization`
- `technical-documentation`
- `vibe-check` (Security scanner & audit)

