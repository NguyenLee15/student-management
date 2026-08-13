-- V1__init_schema.sql

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT uk_users_username UNIQUE (user_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Faculties table
CREATE TABLE IF NOT EXISTS faculties (
    faculty_id VARCHAR(10) PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Academic Years table
CREATE TABLE IF NOT EXISTS academic_years (
    academic_year_id VARCHAR(10) PRIMARY KEY,
    start_year INT NOT NULL,
    end_year INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Student Classes table
CREATE TABLE IF NOT EXISTS student_classes (
    class_id VARCHAR(10) PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    faculty_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_class_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Students table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    class_id VARCHAR(10) NOT NULL,
    academic_year_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES student_classes(class_id),
    CONSTRAINT fk_student_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id VARCHAR(10) PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    credit INT NOT NULL,
    subject_type VARCHAR(20) NOT NULL,
    prerequisite_subject_id VARCHAR(10),
    CONSTRAINT fk_subject_prerequisite FOREIGN KEY (prerequisite_subject_id) REFERENCES subjects(subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
    classroom_id VARCHAR(10) PRIMARY KEY,
    building VARCHAR(20) NOT NULL,
    capacity INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    faculty_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_teacher_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Credit Classes table
CREATE TABLE IF NOT EXISTS credit_classes (
    credit_class_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id VARCHAR(10) NOT NULL,
    teacher_id VARCHAR(10) NOT NULL,
    classroom_id VARCHAR(10) NOT NULL,
    academic_year_id VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    max_students INT NOT NULL,
    CONSTRAINT fk_cc_subject FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    CONSTRAINT fk_cc_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    CONSTRAINT fk_cc_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
    CONSTRAINT fk_cc_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Credit Class Students table
CREATE TABLE IF NOT EXISTS credit_class_students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    credit_class_id BIGINT NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_ccs_cc FOREIGN KEY (credit_class_id) REFERENCES credit_classes(credit_class_id),
    CONSTRAINT fk_ccs_student FOREIGN KEY (student_id) REFERENCES students(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Semester Schedules table
CREATE TABLE IF NOT EXISTS semester_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    credit_class_id BIGINT NOT NULL,
    day_of_week INT NOT NULL,
    start_shift INT NOT NULL,
    end_shift INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    classroom_id VARCHAR(10) NOT NULL,
    CONSTRAINT fk_ss_cc FOREIGN KEY (credit_class_id) REFERENCES credit_classes(credit_class_id),
    CONSTRAINT fk_ss_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Academic Grades table
CREATE TABLE IF NOT EXISTS academic_grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    subject_id VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    study_phase VARCHAR(20) NOT NULL,
    score_scale_10 DECIMAL(3,1),
    score_scale_4 DECIMAL(3,1),
    letter_grade VARCHAR(5) NOT NULL,
    CONSTRAINT uk_academic_grades UNIQUE (student_id, subject_id, semester, academic_year, study_phase),
    CONSTRAINT fk_ag_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_ag_subject FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255),
    details VARCHAR(1000),
    performed_by VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
