-- CH EdTech Database Initialization Script
-- Ensures extensions and baseline privileges

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify vector extension
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
    ) THEN
        RAISE NOTICE 'Extension pgvector is successfully enabled in ch_edtech_db.';
    ELSE
        RAISE EXCEPTION 'Failed to initialize pgvector extension.';
    END IF;
END $$;

