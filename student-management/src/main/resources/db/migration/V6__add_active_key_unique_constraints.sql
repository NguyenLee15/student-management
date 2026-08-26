-- V6__add_active_key_unique_constraints.sql
-- Module 1 & 2: Comprehensive Schema Alignment, Active Key Unique Constraints & Optimistic Locking Support

-- 1. Bảng academic_years (Đảm bảo có academic_year_name)
ALTER TABLE academic_years 
  ADD COLUMN IF NOT EXISTS academic_year_name VARCHAR(50);

-- Cập nhật dữ liệu mặc định cho academic_year_name nếu đang null
UPDATE academic_years 
SET academic_year_name = CONCAT(start_year, '-', end_year) 
WHERE academic_year_name IS NULL;

-- 2. Bảng classrooms (Đảm bảo có room_id và room_name)
ALTER TABLE classrooms 
  ADD COLUMN IF NOT EXISTS room_id VARCHAR(10),
  ADD COLUMN IF NOT EXISTS room_name VARCHAR(100);

UPDATE classrooms 
SET room_id = classroom_id, room_name = CONCAT('Phòng ', classroom_id) 
WHERE room_id IS NULL;

-- 3. Bảng subjects (Đảm bảo có tuition_per_credit, credits, faculty_id)
ALTER TABLE subjects 
  ADD COLUMN IF NOT EXISTS tuition_per_credit INT NOT NULL DEFAULT 500000,
  ADD COLUMN IF NOT EXISTS credits INT NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS faculty_id VARCHAR(10);

-- 4. Bảng credit_classes (Thêm credit_class_name, enrolled_count, version và constraints)
ALTER TABLE credit_classes
  ADD COLUMN IF NOT EXISTS credit_class_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS enrolled_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 5. Bảng credit_class_students (Ràng buộc chống duplicate sinh viên)
ALTER TABLE credit_class_students DROP INDEX IF EXISTS uk_credit_class_student;
ALTER TABLE credit_class_students ADD CONSTRAINT uk_credit_class_student UNIQUE (credit_class_id, student_id);

-- 6. Bảng semester_schedules (Đảm bảo các trường lịch học khớp Entity)
ALTER TABLE semester_schedules
  ADD COLUMN IF NOT EXISTS schedule_id BIGINT,
  ADD COLUMN IF NOT EXISTS subject_id VARCHAR(10),
  ADD COLUMN IF NOT EXISTS teacher_id VARCHAR(10),
  ADD COLUMN IF NOT EXISTS room_id VARCHAR(10),
  ADD COLUMN IF NOT EXISTS semester VARCHAR(10),
  ADD COLUMN IF NOT EXISTS academic_year VARCHAR(9),
  ADD COLUMN IF NOT EXISTS study_time VARCHAR(30),
  ADD COLUMN IF NOT EXISTS class_shift VARCHAR(20);

-- 7. Bảng users (Thêm soft-delete và unique active_key)
ALTER TABLE users DROP INDEX IF EXISTS uk_users_username;
ALTER TABLE users DROP INDEX IF EXISTS uk_users_username_active;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at DATETIME;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_key TINYINT NULL DEFAULT 1;
ALTER TABLE users ADD CONSTRAINT uk_users_username_active UNIQUE (user_name, active_key);

-- 8. Bảng students (Soft-delete Unique Constraints với active_key)
ALTER TABLE students DROP INDEX IF EXISTS uk_students_code_active;
ALTER TABLE students DROP INDEX IF EXISTS uk_students_email_active;
ALTER TABLE students ADD COLUMN IF NOT EXISTS active_key TINYINT NULL DEFAULT 1;
ALTER TABLE students ADD CONSTRAINT uk_students_code_active UNIQUE (student_id, active_key);
ALTER TABLE students ADD CONSTRAINT uk_students_email_active UNIQUE (email, active_key);

-- 9. Bảng teachers (Soft-delete Unique Constraints với active_key)
ALTER TABLE teachers DROP INDEX IF EXISTS uk_teachers_code_active;
ALTER TABLE teachers DROP INDEX IF EXISTS uk_teachers_email_active;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS active_key TINYINT NULL DEFAULT 1;
ALTER TABLE teachers ADD CONSTRAINT uk_teachers_code_active UNIQUE (teacher_id, active_key);
ALTER TABLE teachers ADD CONSTRAINT uk_teachers_email_active UNIQUE (email, active_key);

-- 10. Bảng subjects (Soft-delete Unique Constraints với active_key)
ALTER TABLE subjects DROP INDEX IF EXISTS uk_subjects_code_active;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS active_key TINYINT NULL DEFAULT 1;
ALTER TABLE subjects ADD CONSTRAINT uk_subjects_code_active UNIQUE (subject_id, active_key);

-- 11. Bảng academic_grades (Bổ sung attempt_number và composite unique constraint với study_phase và active_key)
ALTER TABLE academic_grades DROP INDEX IF EXISTS uk_academic_grades;
ALTER TABLE academic_grades DROP INDEX IF EXISTS uk_grades_composite_active;
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS attempt_number INT NOT NULL DEFAULT 1;
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS active_key TINYINT NULL DEFAULT 1;
ALTER TABLE academic_grades ADD CONSTRAINT uk_grades_composite_active UNIQUE (student_id, subject_id, semester, academic_year, study_phase, attempt_number, active_key);
