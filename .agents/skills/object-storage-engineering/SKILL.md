# Skill: object-storage-engineering

## Description
Enforces the mandatory rule that no persistent files are stored directly on the application server disk.

## Scope & Applicability
- MinIO (development) and Cloudflare R2 / S3 (production).
- File upload, download, metadata management, and signed URL generation.

## Rules & Principles
1. Business logic must interact only with StorageService interface, never vendor-specific SDKs.
2. Never expose bucket credentials or direct bucket endpoints to clients.
3. Validate magic bytes before persisting metadata. Rename uploaded files to UUIDs.
4. Issue time-limited pre-signed URLs for downloads and direct uploads.
5. Store metadata (file_id, owner_id, object_key, size, mime_type, checksum) in PostgreSQL.

## Checklist
- [ ] No local filesystem writes for persistent files.
- [ ] Pre-signed URL expiry set to sensible TTL (e.g. 15 minutes).
- [ ] Orphaned files cleanup strategy documented.
