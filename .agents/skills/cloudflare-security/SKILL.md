# Skill: cloudflare-security

## Description
Configures Cloudflare as the frontline perimeter security and content distribution network.

## Scope & Applicability
- DNS management, SSL/TLS Full (Strict), WAF custom rules, Rate Limiting, and Turnstile integration.

## Rules & Principles
1. Never expose origin server IP directly to the Internet. Proxy all web traffic through Cloudflare.
2. Enforce strict rate limits on authentication endpoints (/api/auth/login, /api/auth/register, /api/auth/reset-password).
3. Deploy WAF rules blocking malicious user agents, SQL injection patterns, and automated scrapers.
4. Use Cloudflare R2 for zero-egress fee object storage in production.

## Checklist
- [ ] WAF rules documented in docs/CLOUDFLARE_CONFIGURATION.md.
- [ ] Rate limit policies specified per API endpoint tier.
- [ ] Origin access restricted to Cloudflare IP ranges or Cloudflare Tunnel.
