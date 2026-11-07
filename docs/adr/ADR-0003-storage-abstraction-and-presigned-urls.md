# ADR-0003: Storage Abstraction Layer & Pre-signed URLs

## Status
Accepted

## Context
Rule 11 mandates that no persistent files are stored directly on the application server filesystem. Storing files locally leads to stateful server coupling, disk exhaustion risks, and scalability bottlenecks.

## Decision
1. Implement a vendor-neutral StorageService abstraction layer.
2. Development: MinIO S3-compatible container.
3. Production: Cloudflare R2 / AWS S3.
4. Business logic interacts strictly via StorageService.
5. Secure access via time-limited pre-signed URLs (15-minute TTL); verify user ownership (IDOR defense) prior to issuing pre-signed download URLs.

## Consequences
- **Positive:** Stateless application containers, seamless provider interchangeability, zero egress costs with Cloudflare R2.
- **Negative:** Requires pre-signed URL generation step prior to client file download.
