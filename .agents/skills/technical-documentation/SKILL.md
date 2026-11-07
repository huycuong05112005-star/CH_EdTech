# Skill: technical-documentation

## Description
Ensures all technical documentation is rigorous, accurate, up-to-date, and aligned with codebase reality.

## Scope & Applicability
- Central README.md, 24+ architecture specs in docs/, and Architecture Decision Records in docs/adr/.

## Rules & Principles
1. Documentation must reflect actual implementation; never invent benchmark results or fictitious endpoints.
2. Keep docs/PROJECT_STATUS.md and docs/IMPLEMENTATION_LOG.md updated as phases progress.
3. All major architectural decisions must be recorded as an ADR with Context, Decision, and Consequences.
4. Provide clear setup, running, and troubleshooting instructions for new developers.

## Checklist
- [ ] All doc links and file references valid.
- [ ] Architecture diagrams kept in Mermaid format.
- [ ] Release notes and changelog maintained.
