# Requirements Specification (SRS)

## 1. Functional Requirements
- **FR-1:** Multi-portal experience for Public, Student, Teacher, and Admin users.
- **FR-2:** 3D interactive geometry visualizer with mathematical validation.
- **FR-3:** AI Agent assistance with problem parsing and geometry tool calling.
- **FR-4:** Exam management with mandatory Admin approval workflow.
- **FR-5:** Zero direct filesystem uploads; mandatory Object Storage and Pre-signed URLs.

## 2. Non-Functional Requirements
- **NFR-1 (Security):** Adherence to vibe-check rules, OWASP Top 10, IDOR defense, and secure headers.
- **NFR-2 (Performance):** Sub-200ms API response time, 60 FPS 3D canvas rendering.
- **NFR-3 (Availability):** Health probes, automated container recovery, disaster recovery plan.
