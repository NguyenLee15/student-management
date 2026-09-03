-- V15: Add component scores (attendance, midterm, final exam) to academic_grades
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS attendance_score DECIMAL(3,1) NULL;
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS midterm_score DECIMAL(3,1) NULL;
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS final_exam_score DECIMAL(3,1) NULL;

