# Skill: application-security

## Description
Applies deep application-layer security defenses across frontend and backend implementations.

## Scope & Applicability
- Security filters, JWT signing and validation, CORS configuration, CSRF prevention, and input sanitization.

## Rules & Principles
1. Strict adherence to ibe-check rules: never leak secrets, validate ownership on every resource ID.
2. Enforce explicit CORS whitelist. Never use wildcard * with credentials.
3. Apply CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff on all responses.
4. Sanitize all user-rendered rich text and mathematical markdown using DOMPurify.

## Checklist
- [ ] IDOR checks implemented in all resource query handlers.
- [ ] BCrypt password hashing with high work factor.
- [ ] ibe-check automated script passes on test environments.
