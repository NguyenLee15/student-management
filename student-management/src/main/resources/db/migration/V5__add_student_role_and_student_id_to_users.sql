-- Thêm cột student_id vào bảng users để liên kết tài khoản với sinh viên cụ thể
-- student_id có thể null vì ADMIN và TEACHER không cần
ALTER TABLE users ADD COLUMN student_id VARCHAR(50);

-- Thiết lập khóa ngoại liên kết tới bảng students (nếu cần thiết)
-- ALTER TABLE users ADD CONSTRAINT fk_user_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;

-- Cập nhật kiểu enum của cột role trong MySQL (chỉ áp dụng nếu MySQL kiểm tra chặt chẽ, hoặc đơn giản để nguyên VARCHAR nếu JPA tự map)
-- Vì JPA dùng @Enumerated(EnumType.STRING) nên cột ở DB thường là VARCHAR. 
-- Tuy nhiên, nếu là ENUM thực sự ở DB, ta cần thay đổi. Ở đây ta giả định là VARCHAR(255) hoặc ENUM.
-- Để an toàn, thay đổi kiểu cột role để chứa được 'STUDENT' nếu cần thiết.
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;
