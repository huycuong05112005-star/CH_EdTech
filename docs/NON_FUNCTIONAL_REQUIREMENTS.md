# Non-Functional Requirements (NFR)

1. **Security:** No hardcoded secrets, no raw SQL concatenation, IDOR checks on all resource queries, BCrypt password hashing.
2. **Scalability:** Stateless application backend allowing horizontal container scaling behind load balancers.
3. **Observability:** 100% of endpoints instrumented with Micrometer metrics; Prometheus scraping at 15s intervals.
4. **Accessibility:** Responsive design, WCAG AA color contrast, reduced motion support.
