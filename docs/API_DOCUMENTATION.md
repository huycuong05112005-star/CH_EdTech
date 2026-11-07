# API Documentation

### Public Endpoints
- GET /api/health: Platform operational status and database/storage diagnostics.
- POST /api/auth/login: Authenticate and receive JWT token.
- GET /v3/api-docs: OpenAPI 3.0 specification.
- GET /swagger-ui.html: Interactive Swagger UI.

### Protected Storage Endpoints
- POST /api/storage/upload: Upload file to Object Storage (returns ileId).
- GET /api/storage/download-url/{fileId}: Generate 15-minute Pre-signed S3 download URL (enforces IDOR ownership check).

### Protected Geometry Endpoints
- GET /api/geometry/models: Retrieve saved geometry models.
- POST /api/geometry/models: Save serialized 2D/3D geometry model.
