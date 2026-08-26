-- V7__academic_foundation_and_tuition_policy.sql
-- Slice 1: Academic Foundation, Tuition Policy & Dynamic Grade Weights

-- 1. Tạo bảng semesters
CREATE TABLE IF NOT EXISTS semesters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    semester_code VARCHAR(20) NOT NULL UNIQUE,
    academic_year_id VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_semesters_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id)
);

-- 2. Tạo bảng registration_periods
CREATE TABLE IF NOT EXISTS registration_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    semester_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    max_credits_allowed INT NOT NULL DEFAULT 24,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_reg_periods_semester FOREIGN KEY (semester_id) REFERENCES semesters(id)
);

-- 3. Tạo bảng tuition_policies
CREATE TABLE IF NOT EXISTS tuition_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    semester_id BIGINT NOT NULL,
    faculty_id VARCHAR(10) NULL,
    unit_price_per_credit DECIMAL(12,2) NOT NULL DEFAULT 450000.00,
    effective_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_tuition_policies_semester FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT fk_tuition_policies_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id)
);

-- 4. Bổ sung các cột trọng số template vào bảng subjects
ALTER TABLE subjects
    ADD COLUMN IF NOT EXISTS attendance_weight DECIMAL(3,2) NOT NULL DEFAULT 0.10,
    ADD COLUMN IF NOT EXISTS midterm_weight DECIMAL(3,2) NOT NULL DEFAULT 0.30,
    ADD COLUMN IF NOT EXISTS final_exam_weight DECIMAL(3,2) NOT NULL DEFAULT 0.60;

-- 5. Bổ sung các cột snapshot và semester_id vào bảng credit_classes
ALTER TABLE credit_classes
    ADD COLUMN IF NOT EXISTS semester_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS attendance_weight DECIMAL(3,2) NOT NULL DEFAULT 0.10,
    ADD COLUMN IF NOT EXISTS midterm_weight DECIMAL(3,2) NOT NULL DEFAULT 0.30,
    ADD COLUMN IF NOT EXISTS final_exam_weight DECIMAL(3,2) NOT NULL DEFAULT 0.60,
    ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT FALSE;

-- 6. Seed và Backfill dữ liệu học kỳ mặc định cho các lớp học phần cũ
INSERT INTO semesters (id, name, semester_code, academic_year_id, start_date, end_date, active, created_at, updated_at, deleted)
SELECT 1, 'Học kỳ 1 2026-2027', '20261', academic_year_id, '2026-09-01', '2027-01-15', TRUE, NOW(), NOW(), FALSE
FROM academic_years
LIMIT 1
ON DUPLICATE KEY UPDATE name = 'Học kỳ 1 2026-2027';

-- Backfill semester_id cho credit_classes nếu đang null
UPDATE credit_classes 
SET semester_id = 1 
WHERE semester_id IS NULL;
