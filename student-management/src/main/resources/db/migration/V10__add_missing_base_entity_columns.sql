-- V10__add_missing_base_entity_columns.sql

-- 1. Bổ sung các cột BaseEntity cho academic_grades (bị sót ở V2)
ALTER TABLE academic_grades
    ADD COLUMN IF NOT EXISTS created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at DATETIME,
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50),
    ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Bổ sung created_by cho các bảng ở V7 (bị sót)
ALTER TABLE semesters
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE registration_periods
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE tuition_policies
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);

-- 3. Bổ sung created_by cho các bảng ở V8 (bị sót)
ALTER TABLE enrollments
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE tuition_invoices
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE tuition_items
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
ALTER TABLE tuition_payments
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);

-- 4. Bổ sung created_by cho các bảng ở V9 (bị sót)
ALTER TABLE payment_transactions
    ADD COLUMN IF NOT EXISTS created_by VARCHAR(50);
