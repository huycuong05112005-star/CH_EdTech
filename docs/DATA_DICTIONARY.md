# Data Dictionary

### Table: users
- id (UUID, PK): Unique user identifier.
- email (VARCHAR, Unique): User email address.
- password_hash (VARCHAR): BCrypt hashed password.
- ull_name (VARCHAR): Display name.
- ole (VARCHAR): ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT.
- status (VARCHAR): ACTIVE, INACTIVE, SUSPENDED.

### Table: iles_metadata
- id (UUID, PK): Unique file identifier.
- owner_id (UUID, FK -> users.id): File uploader.
- object_key (VARCHAR, Unique): Path inside S3 bucket.
- ucket (VARCHAR): Target bucket name.
- mime_type (VARCHAR): MIME type verified by magic bytes.
- isibility (VARCHAR): PUBLIC or PRIVATE.

### Table: document_chunks
- id (UUID, PK): Chunk identifier.
- document_id (UUID, FK -> knowledge_documents.id): Document parent.
- content (TEXT): Text chunk.
- embedding (VECTOR(1536)): High-dimensional vector embedding.
