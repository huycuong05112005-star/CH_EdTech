-- V3: Schema for Classrooms, Memberships, and Structured Drawings
-- Supports real classroom collaboration and persistent digital geometry boards

-- Table: classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL DEFAULT 'Toán Học',
    grade_level VARCHAR(50) NOT NULL DEFAULT 'Khối 11',
    join_code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CONCLUDED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classrooms_join_code ON classrooms(join_code);

-- Table: classroom_members
CREATE TABLE IF NOT EXISTS classroom_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED', 'LEFT')),
    CONSTRAINT uq_classroom_student UNIQUE (classroom_id, student_id)
);

CREATE INDEX idx_members_classroom ON classroom_members(classroom_id);
CREATE INDEX idx_members_student ON classroom_members(student_id);

-- Table: drawings (Structured JSON representation of digital geometry boards)
CREATE TABLE IF NOT EXISTS drawings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Bản vẽ hình học',
    description TEXT,
    data_json JSONB NOT NULL,
    thumbnail_url VARCHAR(500),
    visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'CLASSROOM')),
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drawings_owner ON drawings(owner_id);
CREATE INDEX idx_drawings_classroom ON drawings(classroom_id);

-- Seed an initial active classroom for teacher@chedtech.edu.vn with join code 'TOAN11'
INSERT INTO classrooms (id, teacher_id, name, description, subject, grade_level, join_code, status) VALUES
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Toán 11A1 - Chuyên Đề Hình Học Không Gian', 'Lớp học trực tuyến nghiên cứu quan hệ song song, vuông góc và thiết diện khối đa diện.', 'Toán Học', 'Khối 11', 'TOAN11', 'ACTIVE')
ON CONFLICT (join_code) DO NOTHING;

-- Enroll the test student into this classroom
INSERT INTO classroom_members (id, classroom_id, student_id, status) VALUES
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'ACTIVE')
ON CONFLICT (classroom_id, student_id) DO NOTHING;

