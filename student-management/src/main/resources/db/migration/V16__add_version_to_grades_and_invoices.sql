-- V16: Add optimistic locking version column to academic_grades and tuition_invoices
ALTER TABLE academic_grades ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE tuition_invoices ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
