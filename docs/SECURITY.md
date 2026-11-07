# Security Architecture & Vibe-Check Compliance

## 1. Non-Negotiable Rules Summary
1. **Zero Secret Leaks:** .env gitignored, no API keys or database passwords in frontend code.
2. **IDOR Defense:** Every entity modification verifies current_user.id == resource.owner_id || hasRole('ADMIN').
3. **No Filesystem Uploads:** All files stored in private Object Storage; pre-signed URLs required.
4. **Secure Headers:** Strict-Transport-Security (HSTS), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Content-Security-Policy.
5. **CORS:** Explicit allowlist; no wildcard with credentials.
6. **Password Hashing:** BCrypt with work factor 12.
7. **Error Masking:** No stack traces or SQL errors leaked to API responses.

## 2. Automated Live Scanner
Integrated ibe-check (.agents/skills/vibe-check/scripts/check.py) for black-box header and security auditing.
