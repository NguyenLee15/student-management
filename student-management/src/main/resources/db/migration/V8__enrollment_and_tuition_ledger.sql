-- V8__enrollment_and_tuition_ledger.sql
-- Slice 2: Enrollments, Unique Soft-Delete Active Key & Tuition Ledger

-- 1. Tạo bảng enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    credit_class_id BIGINT NOT NULL,
    semester_id BIGINT NOT NULL,
    enrollment_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',
    drop_date DATETIME NULL,
    active_key TINYINT GENERATED ALWAYS AS (CASE WHEN status = 'ENROLLED' THEN 1 ELSE NULL END) VIRTUAL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_enrollments_credit_class FOREIGN KEY (credit_class_id) REFERENCES credit_classes(credit_class_id),
    CONSTRAINT fk_enrollments_semester FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT uk_student_active_enrollment UNIQUE (student_id, credit_class_id, active_key)
);

-- 2. Tạo bảng tuition_invoices (Hóa đơn học phí theo học kỳ của sinh viên)
CREATE TABLE IF NOT EXISTS tuition_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_code VARCHAR(50) NOT NULL UNIQUE,
    student_id VARCHAR(10) NOT NULL,
    semester_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    due_date DATE NOT NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_invoices_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_invoices_semester FOREIGN KEY (semester_id) REFERENCES semesters(id),
    CONSTRAINT uk_student_semester_invoice UNIQUE (student_id, semester_id)
);

-- 3. Tạo bảng tuition_items (Dòng chi tiết học phí từng môn đã đăng ký)
CREATE TABLE IF NOT EXISTS tuition_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    credit_class_id BIGINT NOT NULL,
    credits INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_items_invoice FOREIGN KEY (invoice_id) REFERENCES tuition_invoices(id),
    CONSTRAINT fk_items_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    CONSTRAINT fk_items_credit_class FOREIGN KEY (credit_class_id) REFERENCES credit_classes(credit_class_id)
);

-- 4. Tạo bảng tuition_payments (Biên lai thanh toán học phí)
CREATE TABLE IF NOT EXISTS tuition_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(50) NOT NULL UNIQUE,
    invoice_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'BANK_TRANSFER',
    payment_time DATETIME NOT NULL,
    note VARCHAR(255) NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_payments_invoice FOREIGN KEY (invoice_id) REFERENCES tuition_invoices(id)
);
