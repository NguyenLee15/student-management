-- V19: Add performance indexes for frequent search, sort, and join queries
-- cSpell:disable

-- 1. Indexes for audit logs (sorted by timestamp on every admin view)
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);

-- 2. Indexes for academic grades (frequent lookups by student and subject)
CREATE INDEX idx_academic_grades_student ON academic_grades(student_id);
CREATE INDEX idx_academic_grades_subject ON academic_grades(subject_id);

-- 3. Indexes for credit classes (filtered by semester and teacher)
CREATE INDEX idx_credit_classes_semester ON credit_classes(semester_id);
CREATE INDEX idx_credit_classes_teacher ON credit_classes(teacher_id);

-- 4. Indexes for student enrollments (frequent lookup for student timetable and transcript)
CREATE INDEX idx_enrollments_student_sem ON enrollments(student_id, semester_id);

