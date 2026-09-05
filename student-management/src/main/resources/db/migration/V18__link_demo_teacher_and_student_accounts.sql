-- V18: Link existing demo teacher and student accounts to their corresponding teacher_id and student_id
UPDATE users SET teacher_id = 'GV001' WHERE user_name = 'teacher' AND (teacher_id IS NULL OR teacher_id = '');
UPDATE users SET teacher_id = 'GV002' WHERE user_name = 'teacher2' AND (teacher_id IS NULL OR teacher_id = '');
UPDATE users SET teacher_id = 'GV003' WHERE user_name = 'teacher3' AND (teacher_id IS NULL OR teacher_id = '');
UPDATE users SET teacher_id = 'GV004' WHERE user_name = 'teacher4' AND (teacher_id IS NULL OR teacher_id = '');

UPDATE users SET student_id = 'SV001' WHERE user_name = 'student' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV002' WHERE user_name = 'student2' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV003' WHERE user_name = 'student3' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV004' WHERE user_name = 'student4' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV005' WHERE user_name = 'student5' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV006' WHERE user_name = 'student6' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV007' WHERE user_name = 'student7' AND (student_id IS NULL OR student_id = '');
UPDATE users SET student_id = 'SV008' WHERE user_name = 'student8' AND (student_id IS NULL OR student_id = '');
