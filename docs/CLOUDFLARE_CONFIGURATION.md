# Cloudflare Perimeter Defense Configuration

## 1. Architectural Role
Cloudflare acts as the edge reverse proxy, DDoS mitigation layer, Web Application Firewall (WAF), and Bot Management shield.

## 2. Recommended Configuration
1. **SSL/TLS:** Full (Strict) mode with origin CA certificate.
2. **WAF Rules:** Block OWASP Top 10 attack vectors (SQLi, XSS, Path Traversal).
3. **Rate Limiting Rules:**
   - /api/auth/login: 5 requests per minute per IP.
   - /api/auth/register: 3 requests per minute per IP.
   - /api/storage/upload: 20 requests per minute per authenticated user.
4. **Bot Management:** Enable Cloudflare Turnstile on public login and registration flows.
5. **Origin Protection:** Restrict incoming connections to Cloudflare IP ranges or Cloudflare Tunnel (cloudflared).
