# Object Storage Architecture

## 1. Mandatory Rule
**Never store uploaded user files directly on the local application server filesystem.**
All persistent assets (diagrams, exam PDFs, student submissions, geometry models) must be stored in Object Storage.

## 2. Storage Providers
- **Development:** MinIO (S3-compatible) running in Docker container ch_edtech_minio.
- **Production:** Cloudflare R2 (S3-compatible, zero egress fees) or AWS S3.

## 3. Storage Abstraction Layer
The application interacts strictly with the StorageService interface:
`java
public interface StorageService {
    String uploadFile(UUID ownerId, String filename, String contentType, long size, InputStream stream, boolean isPublic);
    String generatePresignedDownloadUrl(UUID fileId, UUID requestingUserId, Duration duration);
    void deleteFile(UUID fileId, UUID requestingUserId);
}
`

## 4. Security Measures
1. Files renamed to UUIDs upon upload.
2. File magic bytes verified to prevent extension spoofing.
3. Private files require 15-minute time-limited Pre-signed URLs.
4. IDOR defense: verified owner before issuing pre-signed download URLs.
