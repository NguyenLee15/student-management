-- ==============================================================================
-- EDUPORTAL AI - DEMO DATA SCRIPT FOR RECRUITER & EMPLOYER DEMONSTRATION
-- Idempotent SQL script for direct import into MySQL / Docker CSDL
-- ==============================================================================

-- 1. Bảng Users (Mật khẩu: admin123, teacher123, student123 - mã hóa BCrypt)
INSERT INTO users (user_name, password, role, teacher_id, student_id, deleted, created_at, updated_at) VALUES
('admin', '$2a$10$wT0XqXN39H2lW.XvVbHn9u3Yx3K2P.nS4Gz5Zq9xM6XqL8l5m5o2W', 'ADMIN', NULL, NULL, false, NOW(), NOW()),
('teacher', '$2a$10$k1w1wD7k2pE0yY0m1oEw3.fD2d8X1i0Q3G5X9m7k1w1wD7k2pE0yY', 'TEACHER', 'GV001', NULL, false, NOW(), NOW()),
('teacher2', '$2a$10$k1w1wD7k2pE0yY0m1oEw3.fD2d8X1i0Q3G5X9m7k1w1wD7k2pE0yY', 'TEACHER', 'GV002', NULL, false, NOW(), NOW()),
('student', '$2a$10$z9e8d7c6b5a4z9e8d7c6b.fD2d8X1i0Q3G5X9m7k1w1wD7k2pE0yY', 'STUDENT', NULL, 'SV001', false, NOW(), NOW()),
('student2', '$2a$10$z9e8d7c6b5a4z9e8d7c6b.fD2d8X1i0Q3G5X9m7k1w1wD7k2pE0yY', 'STUDENT', NULL, 'SV002', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. Khoa viện (Faculties)
INSERT INTO faculties (faculty_id, faculty_name, deleted, created_at, updated_at) VALUES
('CNTT', 'Công nghệ thông tin', false, NOW(), NOW()),
('KTPM', 'Kỹ thuật phần mềm', false, NOW(), NOW()),
('DTVT', 'Điện tử viễn thông', false, NOW(), NOW()),
('QTKD', 'Quản trị kinh doanh', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE faculty_name = VALUES(faculty_name);

-- 3. Khóa học (Academic Years)
INSERT INTO academic_years (academic_year_id, start_year, end_year, academic_year_name, deleted, created_at, updated_at) VALUES
('K64', 2019, 2023, '2019-2023', false, NOW(), NOW()),
('K65', 2020, 2024, '2020-2024', false, NOW(), NOW()),
('K66', 2021, 2025, '2021-2025', false, NOW(), NOW()),
('K67', 2022, 2026, '2022-2026', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE academic_year_name = VALUES(academic_year_name);

-- 4. Lớp sinh hoạt (Student Classes)
INSERT INTO student_classes (class_id, class_name, faculty_id, deleted, created_at, updated_at) VALUES
('CNTT1-K65', 'Lớp CNTT 1 - K65', 'CNTT', false, NOW(), NOW()),
('CNTT2-K65', 'Lớp CNTT 2 - K65', 'CNTT', false, NOW(), NOW()),
('KTPM1-K65', 'Lớp KTPM 1 - K65', 'KTPM', false, NOW(), NOW()),
('KTPM2-K65', 'Lớp KTPM 2 - K65', 'KTPM', false, NOW(), NOW()),
('DTVT1-K66', 'Lớp ĐTVT 1 - K66', 'DTVT', false, NOW(), NOW()),
('QTKD1-K66', 'Lớp QTKD 1 - K66', 'QTKD', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE class_name = VALUES(class_name);

-- 5. Phòng học (Classrooms)
INSERT INTO classrooms (classroom_id, room_name, building, capacity, deleted, created_at, updated_at) VALUES
('A101', 'Phòng A101 Lý thuyết', 'A', 60, false, NOW(), NOW()),
('A102', 'Phòng A102 Lý thuyết', 'A', 60, false, NOW(), NOW()),
('B201', 'Phòng B201 Đa năng', 'B', 80, false, NOW(), NOW()),
('B202', 'Phòng B202 Đa năng', 'B', 80, false, NOW(), NOW()),
('C301', 'Phòng Lab C301 Máy tính', 'C', 40, false, NOW(), NOW()),
('C302', 'Phòng Lab C302 Máy tính', 'C', 40, false, NOW(), NOW())
ON DUPLICATE KEY UPDATE room_name = VALUES(room_name);

-- 6. Môn học & Điều kiện tiên quyết (Subjects & Prerequisites)
INSERT INTO subjects (subject_id, subject_name, credits, tuition_per_credit, subject_type, faculty_id, prerequisite_subject_id, attendance_weight, midterm_weight, final_exam_weight, deleted, created_at, updated_at) VALUES
('JAVA01', 'Lập trình Java căn bản', 3, 500000, 'MAJOR', 'CNTT', NULL, 0.10, 0.30, 0.60, false, NOW(), NOW()),
('DSA02', 'Cấu trúc dữ liệu & Giải thuật', 4, 500000, 'MAJOR', 'CNTT', 'JAVA01', 0.20, 0.20, 0.60, false, NOW(), NOW()),
('DB03', 'Cơ sở dữ liệu', 3, 500000, 'MAJOR', 'CNTT', NULL, 0.10, 0.30, 0.60, false, NOW(), NOW()),
('SA04', 'Kiến trúc & Thiết kế phần mềm', 3, 500000, 'SPECIALIZED', 'KTPM', 'DB03', 0.10, 0.30, 0.60, false, NOW(), NOW()),
('AI05', 'Trí tuệ nhân tạo', 3, 500000, 'SPECIALIZED', 'CNTT', 'DSA02', 0.10, 0.30, 0.60, false, NOW(), NOW()),
('NET06', 'Mạng máy tính', 3, 500000, 'BASIC', 'DTVT', NULL, 0.10, 0.30, 0.60, false, NOW(), NOW()),
('WEB07', 'Phát triển ứng dụng Web', 3, 500000, 'MAJOR', 'CNTT', 'JAVA01', 0.10, 0.30, 0.60, false, NOW(), NOW())
ON DUPLICATE KEY UPDATE subject_name = VALUES(subject_name);

-- 7. Giảng viên (Teachers)
INSERT INTO teachers (teacher_id, full_name, email, faculty_id, deleted, created_at, updated_at) VALUES
('GV001', 'TS. Nguyễn Văn An', 'nguyenvanan@university.edu.vn', 'CNTT', false, NOW(), NOW()),
('GV002', 'ThS. Trần Thị Bích', 'tranthibich@university.edu.vn', 'KTPM', false, NOW(), NOW()),
('GV003', 'PGS.TS. Lê Hoàng Nam', 'lehoangnam@university.edu.vn', 'CNTT', false, NOW(), NOW()),
('GV004', 'ThS. Phạm Minh Tuấn', 'phamminhtuan@university.edu.vn', 'DTVT', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 8. Sinh viên (Students)
INSERT INTO students (student_id, full_name, date_of_birth, gender, email, class_id, academic_year_id, deleted, created_at, updated_at) VALUES
('SV001', 'Nguyễn Hữu Đạt', '2002-05-15', 'MALE', 'dat.nh@student.edu.vn', 'CNTT1-K65', 'K65', false, NOW(), NOW()),
('SV002', 'Trần Mai Phương', '2002-08-20', 'FEMALE', 'phuong.tm@student.edu.vn', 'KTPM1-K65', 'K65', false, NOW(), NOW()),
('SV003', 'Lê Quốc Cường', '2003-01-10', 'MALE', 'cuong.lq@student.edu.vn', 'CNTT2-K65', 'K65', false, NOW(), NOW()),
('SV004', 'Vũ Thùy Linh', '2003-11-25', 'FEMALE', 'linh.vt@student.edu.vn', 'DTVT1-K66', 'K66', false, NOW(), NOW()),
('SV005', 'Hoàng Gia Bảo', '2002-03-12', 'MALE', 'bao.hg@student.edu.vn', 'CNTT1-K65', 'K65', false, NOW(), NOW()),
('SV006', 'Phạm Thị Ngọc Anh', '2002-12-05', 'FEMALE', 'anh.ptn@student.edu.vn', 'KTPM2-K65', 'K65', false, NOW(), NOW()),
('SV007', 'Đặng Tuấn Anh', '2002-07-18', 'MALE', 'anh.dt@student.edu.vn', 'CNTT2-K65', 'K65', false, NOW(), NOW()),
('SV008', 'Ngô Bích Thảo', '2003-09-30', 'FEMALE', 'thao.nb@student.edu.vn', 'QTKD1-K66', 'K66', false, NOW(), NOW())
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
