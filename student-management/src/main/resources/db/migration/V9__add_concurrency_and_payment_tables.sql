-- V9__add_concurrency_and_payment_tables.sql
-- Concurrency & PayOS Payment Transactions

-- 1. Bổ sung version và enrolled_count cho credit_classes nếu chưa có
ALTER TABLE credit_classes
    ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS enrolled_count INT NOT NULL DEFAULT 0;

-- 2. Tạo bảng payment_transactions để lưu vết toàn bộ giao dịch PayOS
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    invoice_id BIGINT NOT NULL,
    order_code BIGINT NOT NULL UNIQUE,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    checkout_url VARCHAR(1000) NULL,
    qr_code VARCHAR(2000) NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'PAYOS',
    provider_transaction_id VARCHAR(100) NULL,
    raw_webhook_payload TEXT NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_pay_trans_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT fk_pay_trans_invoice FOREIGN KEY (invoice_id) REFERENCES tuition_invoices(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tạo index phục vụ tìm kiếm nhanh giao dịch
CREATE INDEX idx_payment_transactions_order_code ON payment_transactions(order_code);
CREATE INDEX idx_payment_transactions_student ON payment_transactions(student_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

