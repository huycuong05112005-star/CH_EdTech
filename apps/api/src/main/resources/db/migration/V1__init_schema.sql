-- V1: Initial Database Schema for CH EdTech
-- Defines Core Tables: Users, Files Metadata, Geometry Models, Courses, Audit Logs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT')),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Table: files_metadata (Persistent file references stored in Object Storage)
CREATE TABLE IF NOT EXISTS files_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    object_key VARCHAR(500) NOT NULL UNIQUE,
    bucket VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'minio',
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    checksum VARCHAR(64),
    visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'DELETED', 'PENDING')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_owner ON files_metadata(owner_id);
CREATE INDEX idx_files_object_key ON files_metadata(object_key);

-- Table: geometry_models (2D/3D Mathematical Models serialized)
CREATE TABLE IF NOT EXISTS geometry_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dimension_type VARCHAR(10) NOT NULL CHECK (dimension_type IN ('2D', '3D')),
    math_definition JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geometry_creator ON geometry_models(creator_id);

-- Table: courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_teacher ON courses(teacher_id);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);

-- Seed initial test accounts (Passwords hashed with BCrypt, password is: password123)
-- Hash for password123: $2a$12$8crkpeLIkIoG3GUBCq/p1OzoALdKoeN3XmUO1V7g9KVvArKO/GLdm
INSERT INTO users (id, email, password_hash, full_name, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@chedtech.edu.vn', '$2a$12$8crkpeLIkIoG3GUBCq/p1OzoALdKoeN3XmUO1V7g9KVvArKO/GLdm', 'Hệ Thống Quản Trị Viên', 'ROLE_ADMIN', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'teacher@chedtech.edu.vn', '$2a$12$8crkpeLIkIoG3GUBCq/p1OzoALdKoeN3XmUO1V7g9KVvArKO/GLdm', 'Giáo Viên Toán Học', 'ROLE_TEACHER', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'student@chedtech.edu.vn', '$2a$12$8crkpeLIkIoG3GUBCq/p1OzoALdKoeN3XmUO1V7g9KVvArKO/GLdm', 'Học Sinh Chuyên Toán', 'ROLE_STUDENT', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

